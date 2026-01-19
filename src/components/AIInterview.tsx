import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, CheckCircle2, Trophy } from 'lucide-react';
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

interface AIInterviewProps {
  lesson: Lesson;
  onComplete: (lessonId: string, xpEarned: number) => void;
  onBack: () => void;
}

const MIN_DURATION = 30; // 30 seconds minimum per question

const AIInterview: React.FC<AIInterviewProps> = ({ lesson, onComplete, onBack }) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState<Record<number, { transcript: string; duration: number }>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [finalResults, setFinalResults] = useState<{
    overallScore: number;
    fluency: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    feedback: string;
  } | null>(null);
  
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecordingRef = useRef(false);

  const currentQuestion = lesson.content[currentIndex];
  const progress = ((currentIndex + 1) / lesson.content.length) * 100;

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
        setRecordedDuration((prev) => prev + 1);
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
    
    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        transcript: transcript,
        duration: recordedDuration,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < lesson.content.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTranscript('');
      setRecordedDuration(0);
      setIsRecording(false);
    } else {
      // All questions answered, evaluate
      handleFinalEvaluation();
    }
  };

  const handleFinalEvaluation = () => {
    setIsEvaluating(true);
    
    // Simulate comprehensive AI evaluation
    setTimeout(() => {
      const totalWords = Object.values(answers).reduce((sum, ans) => {
        return sum + ans.transcript.split(/\s+/).filter(w => w.length > 0).length;
      }, transcript.split(/\s+/).filter(w => w.length > 0).length);
      
      const totalDuration = Object.values(answers).reduce((sum, ans) => sum + ans.duration, recordedDuration);
      const avgWordsPerMinute = (totalWords / (totalDuration / 60));
      
      // Calculate scores (simulated - would use OpenAI in production)
      const fluency = Math.min(Math.round((avgWordsPerMinute / 150) * 100), 100);
      const grammar = Math.round(70 + Math.random() * 20); // Simulated
      const vocabulary = Math.round(65 + Math.random() * 25); // Simulated
      const pronunciation = Math.round(75 + Math.random() * 20); // Simulated
      
      const overallScore = Math.round((fluency * 0.3 + grammar * 0.25 + vocabulary * 0.25 + pronunciation * 0.2));
      
      let feedback = '';
      if (overallScore >= 85) {
        feedback = 'Excellent! You have demonstrated strong English proficiency. Your fluency, grammar, vocabulary, and pronunciation are all at a high level. Keep up the great work!';
      } else if (overallScore >= 70) {
        feedback = 'Good job! You have a solid command of English. There are some areas for improvement, but overall you communicate effectively. Continue practicing to reach the next level.';
      } else if (overallScore >= 55) {
        feedback = 'You\'re making progress! Your English skills are developing well. Focus on practicing more to improve fluency and expand your vocabulary.';
      } else {
        feedback = 'Keep practicing! You have a foundation in English. Regular practice with pronunciation, vocabulary, and grammar will help you improve significantly.';
      }
      
      setFinalResults({
        overallScore,
        fluency,
        grammar,
        vocabulary,
        pronunciation,
        feedback,
      });
      
      setIsEvaluating(false);
    }, 3000);
  };

  const handleComplete = () => {
    const xpEarned = finalResults ? Math.round(finalResults.overallScore * 2) : 100;
    onComplete(lesson.id, xpEarned);
  };

  if (finalResults) {
    return (
      <div className="min-h-screen gradient-hero p-4">
        <div className="container mx-auto max-w-3xl py-8">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl">Interview Complete!</CardTitle>
              <CardDescription>Your comprehensive language assessment results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="bg-primary/10 border border-primary rounded-lg p-6 text-center">
                <div className="text-5xl font-bold mb-2">{finalResults.overallScore}%</div>
                <p className="text-lg font-medium">Overall Score</p>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Fluency</p>
                  <p className="text-2xl font-bold">{finalResults.fluency}%</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Grammar</p>
                  <p className="text-2xl font-bold">{finalResults.grammar}%</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Vocabulary</p>
                  <p className="text-2xl font-bold">{finalResults.vocabulary}%</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pronunciation</p>
                  <p className="text-2xl font-bold">{finalResults.pronunciation}%</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">AI Feedback:</p>
                <p>{finalResults.feedback}</p>
              </div>

              <Button onClick={handleComplete} className="w-full" size="lg">
                Complete Interview
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="container mx-auto max-w-3xl py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentIndex + 1} of {lesson.content.length}</span>
            <span>{Math.floor(recordedDuration / 60)}m {recordedDuration % 60}s</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Interview</CardTitle>
            <CardDescription>
              Answer each question naturally. Speak for at least 30 seconds per question.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-lg font-medium mb-2">Question {currentIndex + 1}:</p>
              <p className="text-xl">{currentQuestion.text}</p>
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
                  Start Answering
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

            {/* Evaluation Status */}
            {isEvaluating && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">AI is evaluating your responses...</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
                disabled={isEvaluating}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
                disabled={!answers[currentIndex] && !transcript || isRecording || isEvaluating}
              >
                {currentIndex === lesson.content.length - 1 ? 'Finish Interview' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInterview;

