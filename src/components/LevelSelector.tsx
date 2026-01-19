import React from 'react';
import { DIFFICULTY_LEVELS, DifficultyLevel } from '@/types/learning';
import { cn } from '@/lib/utils';

interface LevelSelectorProps {
  selectedLevel: DifficultyLevel;
  onSelect: (level: DifficultyLevel) => void;
}

const levelIcons: Record<DifficultyLevel, string> = {
  easy: '🌱',
  medium: '🌿',
  hard: '🌳',
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Select Your Level</h2>
      <p className="text-muted-foreground text-center mb-8">
        Choose based on your current English proficiency
      </p>
      
      <div className="flex flex-col gap-4">
        {DIFFICULTY_LEVELS.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={cn(
              "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left",
              "hover:scale-[1.01] hover:shadow-medium",
              "animate-slide-up opacity-0",
              selectedLevel === level.id
                ? level.id === 'easy'
                  ? "border-success bg-success/5 shadow-md"
                  : level.id === 'medium'
                  ? "border-warning bg-warning/5 shadow-md"
                  : "border-destructive bg-destructive/5 shadow-md"
                : "border-border bg-card hover:border-primary/50"
            )}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{levelIcons[level.id]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-foreground">{level.name}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    level.id === 'easy' && "bg-success/20 text-success",
                    level.id === 'medium' && "bg-warning/20 text-warning",
                    level.id === 'hard' && "bg-destructive/20 text-destructive"
                  )}>
                    {level.id.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
            </div>
            
            {selectedLevel === level.id && (
              <div className={cn(
                "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-bounce-in",
                level.id === 'easy' && "bg-success",
                level.id === 'medium' && "bg-warning",
                level.id === 'hard' && "bg-destructive"
              )}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
