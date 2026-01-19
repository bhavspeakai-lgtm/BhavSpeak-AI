import React, { useState, useEffect } from 'react';
import { Lesson, LessonContent } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { PronunciationResult } from '@/types/learning';
import { Volume2, Mic, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneticSoundPracticeProps {
  lesson: Lesson;
  onComplete: (lessonId: string, xpEarned: number) => void;
  onBack: () => void;
}

const PhoneticSoundPractice: React.FC<PhoneticSoundPracticeProps> = ({ lesson, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const currentWord = lesson.content[currentIndex];
  const { speak, isSpeaking } = useTextToSpeech('american');
  const { startListening, stopListening, transcript, isListening, checkPronunciation } = useSpeechRecognition('american');

  useEffect(() => {
    // Auto-play the word when moving to next word
    if (currentWord && !isPlaying && !isSpeaking) {
      handlePlayWord();
    }
  }, [currentIndex]);

  useEffect(() => {
    setUserTranscript(transcript);
  }, [transcript]);

  const handlePlayWord = async () => {
    if (!currentWord) return;
    setIsPlaying(true);
    await speak(currentWord.text);
    setIsPlaying(false);
  };

  const handleStartRecording = () => {
    setUserTranscript('');
    setPronunciationResult(null);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
    setIsChecking(true);
    
    // Check pronunciation
    const result = checkPronunciation(currentWord.text, userTranscript || transcript);
    setPronunciationResult(result);
    
    if (result.isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setCompletedWords((prev) => new Set([...prev, currentIndex]));
    }
    
    setIsChecking(false);
  };

  const handleNext = () => {
    if (currentIndex < lesson.content.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserTranscript('');
      setPronunciationResult(null);
    } else {
      // Lesson complete
      const xpEarned = correctCount * 10 + (correctCount === lesson.content.length ? 50 : 0);
      onComplete(lesson.id, xpEarned);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setUserTranscript('');
      setPronunciationResult(null);
    }
  };

  const progress = ((currentIndex + 1) / lesson.content.length) * 100;
  const isWordCompleted = completedWords.has(currentIndex);

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="container mx-auto max-w-3xl py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{currentIndex + 1} / {lesson.content.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>
              Listen to the AI pronunciation, then repeat the word. Practice all {lesson.content.length} words.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Word Display */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary mb-4">
                {currentWord.text}
              </div>
              {currentWord.phonetic && (
                <div className="text-2xl text-muted-foreground">
                  {currentWord.phonetic}
                </div>
              )}
            </div>

            {/* AI Pronunciation Button */}
            <div className="flex justify-center">
              <Button
                onClick={handlePlayWord}
                disabled={isSpeaking || isPlaying}
                size="lg"
                className="gap-2"
              >
                <Volume2 className="w-5 h-5" />
                {isSpeaking ? 'Playing...' : 'Listen to AI Pronunciation'}
              </Button>
            </div>

            {/* User Recording Section */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Now repeat the word after listening
                </p>
                
                {!isListening ? (
                  <Button
                    onClick={handleStartRecording}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    disabled={isChecking}
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopRecording}
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {/* Transcript Display */}
              {userTranscript && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">You said:</p>
                  <p className="text-lg">{userTranscript}</p>
                </div>
              )}

              {/* Pronunciation Feedback */}
              {pronunciationResult && (
                <div className={cn(
                  "p-4 rounded-lg border-2",
                  pronunciationResult.isCorrect
                    ? "bg-success/10 border-success"
                    : "bg-destructive/10 border-destructive"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {pronunciationResult.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="font-semibold">
                      {pronunciationResult.isCorrect ? 'Correct!' : 'Try Again'}
                    </span>
                  </div>
                  <p className="text-sm">{pronunciationResult.feedback}</p>
                  {pronunciationResult.confidence && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Confidence: {Math.round(pronunciationResult.confidence * 100)}%
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentIndex === 0}
                className="flex-1 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 gap-2"
                disabled={!pronunciationResult && !isWordCompleted}
              >
                {currentIndex === lesson.content.length - 1 ? 'Complete Lesson' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Score */}
            <div className="text-center text-sm text-muted-foreground">
              Correct: {correctCount} / {lesson.content.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneticSoundPractice;

