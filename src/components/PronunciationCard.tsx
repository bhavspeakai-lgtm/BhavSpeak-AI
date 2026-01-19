import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { LessonContent, Accent, PronunciationResult } from '@/types/learning';
import { cn } from '@/lib/utils';
import { Volume2, Mic, MicOff, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface PronunciationCardProps {
  content: LessonContent;
  accent: Accent;
  onComplete: (correct: boolean) => void;
}

const PronunciationCard: React.FC<PronunciationCardProps> = ({ content, accent, onComplete }) => {
  const { speak, isSpeaking } = useTextToSpeech(accent);
  const { isListening, transcript, startListening, stopListening, checkPronunciation, isSupported } = useSpeechRecognition(accent);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (transcript && !isListening && attempts > 0) {
      const pronunciationResult = checkPronunciation(content.text, transcript);
      setResult(pronunciationResult);
      setShowResult(true);
    }
  }, [transcript, isListening, content.text, checkPronunciation, attempts]);

  const handleListen = () => {
    speak(content.text, 0.7);
  };

  const handleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      setResult(null);
      setShowResult(false);
      setAttempts((prev) => prev + 1);
      startListening();
    }
  };

  const handleRetry = () => {
    setResult(null);
    setShowResult(false);
    setTranscript('');
  };

  const setTranscript = (_: string) => {
    // Reset handled by starting new recording
  };

  const handleContinue = () => {
    onComplete(result?.isCorrect ?? false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={cn(
        "p-8 rounded-3xl border-2 bg-card shadow-medium transition-all duration-300",
        showResult && result?.isCorrect && "border-success bg-success/5",
        showResult && !result?.isCorrect && "border-destructive bg-destructive/5",
        !showResult && "border-border"
      )}>
        {/* Main text */}
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-foreground mb-2">{content.text}</p>
          {content.phonetic && (
            <p className="text-lg text-muted-foreground font-mono">{content.phonetic}</p>
          )}
        </div>

        {/* Listen button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleListen}
            disabled={isSpeaking}
            className="gap-2"
          >
            <Volume2 className={cn("w-5 h-5", isSpeaking && "animate-pulse")} />
            {isSpeaking ? 'Playing...' : 'Listen'}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">Your turn</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Record button */}
        <div className="flex justify-center mb-6">
          {isSupported ? (
            <button
              onClick={handleRecord}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                isListening
                  ? "gradient-accent shadow-accent animate-pulse scale-110"
                  : "gradient-primary shadow-primary hover:scale-105"
              )}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-accent-foreground" />
              ) : (
                <Mic className="w-8 h-8 text-primary-foreground" />
              )}
            </button>
          ) : (
            <p className="text-muted-foreground text-center">
              Speech recognition is not supported in your browser.
            </p>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="text-center mb-4 animate-slide-up">
            <p className="text-sm text-muted-foreground mb-1">You said:</p>
            <p className="text-xl font-semibold text-foreground">{transcript}</p>
          </div>
        )}

        {/* Result */}
        {showResult && result && (
          <div className={cn(
            "p-4 rounded-2xl mb-4 animate-bounce-in",
            result.isCorrect ? "bg-success/10" : "bg-destructive/10"
          )}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {result.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <span className={cn(
                "font-bold",
                result.isCorrect ? "text-success" : "text-destructive"
              )}>
                {result.isCorrect ? 'Correct!' : 'Not quite'}
              </span>
            </div>
            <p className="text-center text-sm text-muted-foreground">{result.feedback}</p>
            
            {/* Confidence meter */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Accuracy</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    result.confidence > 0.8 ? "bg-success" : result.confidence > 0.5 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {showResult && (
          <div className="flex gap-3 animate-slide-up">
            {!result?.isCorrect && (
              <Button variant="outline" onClick={handleRetry} className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            <Button
              variant={result?.isCorrect ? "success" : "default"}
              onClick={handleContinue}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PronunciationCard;
