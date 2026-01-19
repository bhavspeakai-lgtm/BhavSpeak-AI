import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AccentSelector from './AccentSelector';
import LevelSelector from './LevelSelector';
import { Accent, DifficultyLevel } from '@/types/learning';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (accent: Accent, level: DifficultyLevel) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [accent, setAccent] = useState<Accent>('american');
  const [level, setLevel] = useState<DifficultyLevel>('easy');

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      onComplete(accent, level);
    }
  };

  const handleBack = () => {
    setStep(0);
  };

  return (
    <div className="min-h-screen flex flex-col gradient-hero">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-5xl animate-float">🗣️</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">SpeakEasy</h1>
        <p className="text-muted-foreground">Master English pronunciation</p>
      </header>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              step === i ? "w-8 gradient-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 px-4 pb-8">
        {step === 0 ? (
          <AccentSelector selectedAccent={accent} onSelect={setAccent} />
        ) : (
          <LevelSelector selectedLevel={level} onSelect={setLevel} />
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
          )}
          <Button variant="hero" size="lg" onClick={handleNext} className="flex-1 gap-2">
            {step === 0 ? 'Continue' : 'Start Learning'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
