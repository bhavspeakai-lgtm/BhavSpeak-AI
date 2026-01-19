import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface SpeakingPracticeProps {
  lesson: Lesson;
  onComplete: (lessonId: string, xpEarned: number) => void;
  onBack: () => void;
}

const MIN_DURATION = 120; // 2 minutes in seconds
const MAX_DURATION = 180; // 3 minutes max

const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ lesson, onComplete, onBack }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecordingRef = useRef(false);

  const topic = lesson.content[0]?.text || '';

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

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

        setTranscript((prev) => {
          const cleaned = prev.trim();
          return cleaned + finalTranscript + interimTranscript;
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
            setIsRecording(false);
          }
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

  const handleStartRecording = () => {
    setTranscript('');
    setRecordedDuration(0);
    setScore(null);
    setFeedback('');
    setIsRecording(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (recordedDuration < MIN_DURATION) {
      toast({
        title: 'Recording Too Short',
        description: `Please record for at least ${MIN_DURATION / 60} minutes.`,
        variant: 'destructive',
      });
      return;
    }

    if (!transcript || transcript.trim().length < 50) {
      toast({
        title: 'No Speech Detected',
        description: 'We couldn\'t detect your speech. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsEvaluating(true);
    
    // Simulate AI evaluation
    setTimeout(() => {
      const wordCount = transcript.split(/\s+/).filter(w => w.length > 0).length;
      const durationMinutes = recordedDuration / 60;
      const wordsPerMinute = wordCount / durationMinutes;
      
      // Calculate score based on fluency, duration, and content
      let calculatedScore = 0;
      
      // Duration score (30%)
      if (recordedDuration >= MIN_DURATION) {
        calculatedScore += 30;
      } else {
        calculatedScore += (recordedDuration / MIN_DURATION) * 30;
      }
      
      // Fluency score (40%) - words per minute
      if (wordsPerMinute >= 100) {
        calculatedScore += 40;
      } else {
        calculatedScore += (wordsPerMinute / 100) * 40;
      }
      
      // Content score (30%) - vocabulary diversity
      const uniqueWords = new Set(transcript.toLowerCase().split(/\s+/)).size;
      const diversityRatio = uniqueWords / Math.max(wordCount, 1);
      calculatedScore += Math.min(diversityRatio * 50, 30);
      
      calculatedScore = Math.min(Math.round(calculatedScore), 100);
      
      setScore(calculatedScore);
      
      if (calculatedScore >= 80) {
        setFeedback('Excellent! You spoke fluently and covered the topic well. Keep up the great work!');
      } else if (calculatedScore >= 60) {
        setFeedback('Good job! You spoke clearly, but try to speak a bit more and use varied vocabulary.');
      } else {
        setFeedback('Keep practicing! Try to speak for the full 2 minutes and use more descriptive words.');
      }
      
      setIsEvaluating(false);
    }, 2000);
  };

  const handleComplete = () => {
    const xpEarned = score ? Math.round(score / 2) : 50;
    onComplete(lesson.id, xpEarned);
  };

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>
              Speak on the given topic for at least 2 minutes. AI will evaluate your fluency and provide feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Topic:</p>
              <p className="text-lg">{topic}</p>
            </div>

            {/* Duration */}
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

            {/* Transcript */}
            {transcript && (
              <div className="bg-background p-4 rounded-lg border max-h-48 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{transcript}</p>
              </div>
            )}

            {/* Recording Controls */}
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
                  variant="destructive"
                  size="lg"
                  className="flex-1 gap-2"
                >
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </Button>
              )}
            </div>

            {/* Evaluation Results */}
            {isEvaluating && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">AI is evaluating your speech...</p>
              </div>
            )}

            {score !== null && !isEvaluating && (
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-2">{score}%</div>
                  <p className="text-sm font-medium">Speaking Score</p>
                </div>
                
                {feedback && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Feedback:</p>
                    <p>{feedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              {score !== null ? (
                <Button
                  onClick={handleComplete}
                  className="flex-1 gap-2"
                >
                  Complete
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={recordedDuration < MIN_DURATION || !transcript || isEvaluating}
                >
                  Submit for Evaluation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeakingPractice;

