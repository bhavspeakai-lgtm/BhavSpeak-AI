import React from 'react';
import { ACCENTS, Accent } from '@/types/learning';
import { cn } from '@/lib/utils';

interface AccentSelectorProps {
  selectedAccent: Accent;
  onSelect: (accent: Accent) => void;
}

const AccentSelector: React.FC<AccentSelectorProps> = ({ selectedAccent, onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Choose Your Accent</h2>
      <p className="text-muted-foreground text-center mb-8">
        Select the English accent you want to learn
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {ACCENTS.map((accent, index) => (
          <button
            key={accent.id}
            onClick={() => onSelect(accent.id)}
            className={cn(
              "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
              "hover:scale-[1.02] hover:shadow-medium",
              "animate-slide-up opacity-0",
              selectedAccent === accent.id
                ? "border-primary bg-primary/5 shadow-primary"
                : "border-border bg-card hover:border-primary/50"
            )}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{accent.flag}</span>
              <div>
                <h3 className="font-bold text-lg text-foreground">{accent.name}</h3>
                <p className="text-sm text-muted-foreground">{accent.description}</p>
              </div>
            </div>
            
            {selectedAccent === accent.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-bounce-in">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default AccentSelector;
