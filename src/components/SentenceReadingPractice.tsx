import React, { useState, useEffect } from 'react';
import { Lesson } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Volume2, Mic, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentenceReadingPracticeProps {
  lesson: Lesson;
  onComplete: (lessonId: string, xpEarned: number) => void;
  onBack: () => void;
}

interface Mistake {
  word: string;
  position: number;
  issue: string;
  suggestion: string;
}

const SentenceReadingPractice: React.FC<SentenceReadingPracticeProps> = ({ lesson, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set());

  const currentSentence = lesson.content[currentIndex];
  const fullText = currentSentence.text;
  const { speak, isSpeaking } = useTextToSpeech('american');
  const { startListening, stopListening, transcript, isListening } = useSpeechRecognition('american');

  useEffect(() => {
    setUserTranscript(transcript);
  }, [transcript]);

  const handlePlaySentence = async () => {
    if (!fullText) return;
    setIsPlaying(true);
    await speak(fullText);
    setIsPlaying(false);
  };

  const handleStartRecording = () => {
    setUserTranscript('');
    setMistakes([]);
    setScore(null);
    startListening();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    stopListening();
    setIsRecording(false);
    analyzePronunciation();
  };

  const analyzePronunciation = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in production, this would call OpenAI API
    setTimeout(() => {
      const userWords = userTranscript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const expectedWords = fullText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      
      const detectedMistakes: Mistake[] = [];
      let correctCount = 0;
      
      // Simple word-by-word comparison (enhanced with AI in production)
      expectedWords.forEach((word, index) => {
        const userWord = userWords[index];
        if (!userWord) {
          detectedMistakes.push({
            word: word,
            position: index,
            issue: 'Missing word',
            suggestion: `You missed the word "${word}"`,
          });
        } else if (userWord !== word && !word.includes(userWord) && !userWord.includes(word)) {
          detectedMistakes.push({
            word: word,
            position: index,
            issue: 'Pronunciation error',
            suggestion: `Try pronouncing "${word}" more clearly`,
          });
        } else {
          correctCount++;
        }
      });
      
      // Calculate score
      const accuracy = (correctCount / expectedWords.length) * 100;
      const finalScore = Math.max(0, Math.round(accuracy - (detectedMistakes.length * 5)));
      
      setMistakes(detectedMistakes);
      setScore(finalScore);
      
      if (finalScore >= 70) {
        setCompletedSentences((prev) => new Set([...prev, currentIndex]));
      }
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleNext = () => {
    if (currentIndex < lesson.content.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserTranscript('');
      setMistakes([]);
      setScore(null);
    } else {
      // Lesson complete
      const completedCount = completedSentences.size;
      const xpEarned = completedCount * 20 + (completedCount === lesson.content.length ? 100 : 0);
      onComplete(lesson.id, xpEarned);
    }
  };

  const progress = ((currentIndex + 1) / lesson.content.length) * 100;
  const isSentenceCompleted = completedSentences.has(currentIndex);

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="container mx-auto max-w-4xl py-8">
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
              Listen to the AI read the sentence, then read it yourself. AI will analyze your pronunciation and mark mistakes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sentence Display */}
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-xl leading-relaxed">{fullText}</p>
            </div>

            {/* AI Pronunciation Button */}
            <div className="flex justify-center">
              <Button
                onClick={handlePlaySentence}
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
                  Now read the sentence aloud
                </p>
                
                {!isRecording ? (
                  <Button
                    onClick={handleStartRecording}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    disabled={isAnalyzing}
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
                    Stop Recording & Analyze
                  </Button>
                )}
              </div>

              {/* Transcript Display */}
              {userTranscript && (
                <div className="bg-background p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-1">You read:</p>
                  <p className="text-lg">{userTranscript}</p>
                </div>
              )}

              {/* Analysis Results */}
              {isAnalyzing && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">AI is analyzing your pronunciation...</p>
                </div>
              )}

              {score !== null && !isAnalyzing && (
                <div className="space-y-4">
                  {/* Score */}
                  <div className={cn(
                    "p-4 rounded-lg border-2 text-center",
                    score >= 70 ? "bg-success/10 border-success" : "bg-warning/10 border-warning"
                  )}>
                    <div className="text-3xl font-bold mb-2">{score}%</div>
                    <p className="text-sm">
                      {score >= 90 ? 'Excellent!' : score >= 70 ? 'Good job!' : 'Keep practicing!'}
                    </p>
                  </div>

                  {/* Mistakes */}
                  {mistakes.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span className="font-semibold">Pronunciation Mistakes Found: {mistakes.length}</span>
                      </div>
                      <div className="space-y-2">
                        {mistakes.map((mistake, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">"{mistake.word}"</span>: {mistake.suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mistakes.length === 0 && (
                    <div className="bg-success/10 border border-success rounded-lg p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="font-semibold">Perfect! No mistakes detected.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 gap-2"
                disabled={score === null && !isSentenceCompleted}
              >
                {currentIndex === lesson.content.length - 1 ? 'Complete Lesson' : 'Next Sentence'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentenceReadingPractice;

