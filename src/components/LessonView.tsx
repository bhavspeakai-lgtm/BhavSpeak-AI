import React from 'react';
import { Module, Lesson, Accent } from '@/types/learning';
import PhoneticSoundPractice from './PhoneticSoundPractice';
import SentenceReadingPractice from './SentenceReadingPractice';
import SpeakingPractice from './SpeakingPractice';
import AIInterview from './AIInterview';

interface LessonViewProps {
  module: Module;
  lesson: Lesson;
  accent: Accent;
  onComplete: (lessonId: string, xpEarned: number) => void;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ module, lesson, accent, onComplete, onBack }) => {
  // Route to appropriate practice component based on module type
  if (module.id === 'phonetic-sounds') {
    return (
      <PhoneticSoundPractice
        lesson={lesson}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (module.id === 'sentences-2-3' || module.id === 'sentences-4-5' || module.id === 'sentences-10-20') {
    return (
      <SentenceReadingPractice
        lesson={lesson}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (module.id === 'speaking-topics') {
    return (
      <SpeakingPractice
        lesson={lesson}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (module.id === 'ai-interview') {
    return (
      <AIInterview
        lesson={lesson}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  // Fallback to default view for other modules
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-muted-foreground">Module type not yet implemented</p>
        <button onClick={onBack} className="mt-4 text-primary">Go Back</button>
      </div>
    </div>
  );
};

export default LessonView;
