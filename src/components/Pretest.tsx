import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { PretestTopic, PretestResult, PretestLevel } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Play, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const PRETEST_TOPICS: PretestTopic[] = [
  {
    id: 'self-intro',
    title: 'Self Introduction',
    description: 'Tell us about yourself - your name, where you\'re from, and what you do',
    prompt: 'Please introduce yourself. Tell us your name, where you are from, what you do, and share a few interesting facts about yourself. Speak for at least 3-4 minutes.',
  },
  {
    id: 'daily-routine',
    title: 'Daily Routine',
    description: 'Describe your typical day from morning to night',
    prompt: 'Please describe your daily routine. Talk about what you do from the moment you wake up until you go to bed. Include details about your work, meals, hobbies, and any other activities. Speak for at least 3-4 minutes.',
  },
  {
    id: 'hobby',
    title: 'Share a Hobby',
    description: 'Tell us about a hobby or interest you enjoy',
    prompt: 'Please tell us about a hobby or interest you enjoy. Explain what it is, why you like it, how you got started, and what makes it special to you. Speak for at least 3-4 minutes.',
  },
];

const MIN_DURATION = 30; // 30 seconds for testing (was 180 - 3 minutes)
const MAX_DURATION = 300; // 5 minutes in seconds (allowing some buffer)

const Pretest: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<PretestTopic | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<PretestResult | null>(null);
  
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecordingRef = useRef(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Update ref when state changes
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Custom continuous speech recognition for pretest
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setSpeechTranscript((prev) => {
          // Remove previous interim results and add new final + interim
          const prevFinal = prev.replace(/\s*\[interim\]\s*$/, '').trim();
          const newText = prevFinal + (prevFinal ? ' ' : '') + finalTranscript;
          return newText + (interimTranscript ? ' [interim]' : '');
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecordingRef.current) {
          // Restart if still recording
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setSpeechTranscript('');
      setTranscript(''); // Also clear the display transcript
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    setTranscript(speechTranscript);
  }, [speechTranscript]);

  useEffect(() => {
    if (isRecording) {
      durationIntervalRef.current = setInterval(() => {
        setRecordedDuration((prev) => {
          if (prev >= MAX_DURATION) {
            handleStopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    if (!selectedTopic) {
      toast({
        title: 'Select a Topic',
        description: 'Please select a topic before starting the recording.',
        variant: 'destructive',
      });
      return;
    }

    // Request microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just needed permission
    } catch (error: any) {
      toast({
        title: 'Microphone Permission Required',
        description: 'Please allow microphone access to record your speech.',
        variant: 'destructive',
      });
      return;
    }

    setTranscript('');
    setSpeechTranscript('');
    setRecordedDuration(0);
    setIsRecording(true);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
    setIsRecording(false);
    // Ensure we have the final transcript
    if (speechTranscript && !transcript) {
      setTranscript(speechTranscript);
    }
  };

  const evaluateSpeech = async (transcriptText: string): Promise<PretestResult> => {
    // Simulate AI evaluation
    // In a real application, this would call an AI API to evaluate the speech
    
    // Calculate score based on various factors
    const wordCount = transcriptText.split(/\s+/).filter(w => w.length > 0).length;
    const durationMinutes = recordedDuration / 60;
    
    // Basic scoring algorithm (can be enhanced with actual AI)
    let score = 0;
    
    // Duration score (30% weight)
    if (recordedDuration >= MIN_DURATION) {
      score += 30;
    } else {
      score += (recordedDuration / MIN_DURATION) * 30;
    }
    
    // Word count score (20% weight) - assuming 150-200 words per minute
    const expectedWords = durationMinutes * 175;
    if (wordCount >= expectedWords * 0.8) {
      score += 20;
    } else {
      score += (wordCount / (expectedWords * 0.8)) * 20;
    }
    
    // Vocabulary diversity (20% weight) - simple heuristic
    const uniqueWords = new Set(transcriptText.toLowerCase().split(/\s+/)).size;
    const diversityRatio = uniqueWords / Math.max(wordCount, 1);
    score += Math.min(diversityRatio * 50, 20);
    
    // Grammar and fluency (30% weight) - simulated
    // In production, this would use NLP/AI to analyze grammar, sentence structure, etc.
    const grammarScore = Math.random() * 30 + 50; // Simulated score between 50-80
    score += grammarScore * 0.3;
    
    // Cap score at 100
    score = Math.min(Math.round(score), 100);
    
    // Determine level
    let level: PretestLevel;
    let feedback: string;
    
    if (score >= 80) {
      level = 'L1';
      feedback = 'Excellent! You have a strong command of English. You\'ll start with advanced lessons.';
    } else if (score >= 50) {
      level = 'L2';
      feedback = 'Good job! You have a solid foundation. You\'ll start with intermediate lessons.';
    } else {
      level = 'L3';
      feedback = 'Great start! You\'ll begin with beginner-friendly lessons to build your skills.';
    }
    
    return {
      score,
      level,
      feedback,
      transcript: transcriptText,
      duration: recordedDuration,
    };
  };

  const handleSubmit = async () => {
    // Stop recording if still active
    if (isRecording) {
      handleStopRecording();
      // Wait a bit for transcript to finalize
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (recordedDuration < MIN_DURATION) {
      toast({
        title: 'Recording Too Short',
        description: `Please record for at least ${MIN_DURATION / 60} minutes.`,
        variant: 'destructive',
      });
      return;
    }

    // Use speechTranscript which accumulates all transcripts, remove interim marker
    let finalTranscript = (speechTranscript || transcript).trim();
    finalTranscript = finalTranscript.replace(/\s*\[interim\]\s*/g, '').trim();
    
    if (!finalTranscript || finalTranscript.length < 50) {
      toast({
        title: 'No Speech Detected',
        description: 'We couldn\'t detect your speech. Please try again. Make sure your microphone is working and speak clearly.',
        variant: 'destructive',
      });
      return;
    }

    setIsEvaluating(true);
    
    try {
      const pretestResult = await evaluateSpeech(finalTranscript);
      setResult(pretestResult);
      
      // Update user with pretest results
      updateUser({
        pretestLevel: pretestResult.level,
        pretestScore: pretestResult.score,
        pretestCompleted: true,
      });
      
      toast({
        title: 'Pretest Completed! 🎉',
        description: `You've been assigned level ${pretestResult.level}`,
      });
      
      // Navigate to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Evaluation error:', error);
      toast({
        title: 'Evaluation Failed',
        description: 'An error occurred during evaluation. Please try again.',
        variant: 'destructive',
      });
      setIsEvaluating(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <CardTitle className="text-3xl">Pretest Complete!</CardTitle>
            <CardDescription>Your English proficiency level has been assessed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">Level {result.level}</div>
              <div className="text-2xl text-muted-foreground">Score: {result.score}/100</div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Feedback:</p>
              <p>{result.feedback}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{Math.floor(result.duration / 60)}m {result.duration % 60}s</p>
              </div>
              <div>
                <p className="text-muted-foreground">Words Spoken</p>
                <p className="font-medium">{transcript.split(/\s+/).filter(w => w.length > 0).length}</p>
              </div>
            </div>
            
            <Button onClick={() => navigate('/')} className="w-full" size="lg">
              Start Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedTopic) {
    return (
      <div className="min-h-screen gradient-hero p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">English Proficiency Pretest</h1>
            <p className="text-muted-foreground">
              Select a topic and speak for 3-4 minutes. We'll assess your level and create a personalized learning path.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {PRETEST_TOPICS.map((topic) => (
              <Card
                key={topic.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  "hover:border-primary"
                )}
                onClick={() => setSelectedTopic(topic)}
              >
                <CardHeader>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Pretest: {selectedTopic.title}</CardTitle>
            <CardDescription>{selectedTopic.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Duration</span>
                <span>
                  {Math.floor(recordedDuration / 60)}m {recordedDuration % 60}s
                  {recordedDuration >= MIN_DURATION && ' ✓'}
                </span>
              </div>
              <Progress 
                value={(recordedDuration / MAX_DURATION) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Minimum: {MIN_DURATION / 60} minutes
              </p>
            </div>

            {(transcript || speechTranscript) && (
              <div className="bg-muted p-4 rounded-lg max-h-48 overflow-y-auto">
                <p className="text-sm font-medium mb-1">Your Speech:</p>
                <p className="text-sm whitespace-pre-wrap">
                  {(speechTranscript || transcript).replace(/\s*\[interim\]\s*/g, '')}
                </p>
                {isRecording && (
                  <p className="text-xs text-muted-foreground mt-2">🎤 Recording in progress...</p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="flex-1 gap-2"
                  disabled={isEvaluating}
                >
                  <Mic className="w-5 h-5" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  size="lg"
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </Button>
              )}
            </div>

            {recordedDuration > 0 && !isRecording && (
              <div className="space-y-2">
                <Button
                  onClick={handleStartRecording}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={isEvaluating}
                >
                  <Play className="w-4 h-4" />
                  Record Again
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={isEvaluating || recordedDuration < MIN_DURATION || (!transcript && !speechTranscript)}
                >
                  {isEvaluating ? 'Evaluating...' : 'Submit Pretest'}
                </Button>
              </div>
            )}

            <Button
              onClick={() => setSelectedTopic(null)}
              variant="ghost"
              className="w-full"
            >
              Choose Different Topic
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pretest;

