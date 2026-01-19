import React from 'react';
import { Module, Lesson } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Play, CheckCircle, Lock } from 'lucide-react';

interface LessonListProps {
  module: Module;
  onSelectLesson: (lesson: Lesson) => void;
  onBack: () => void;
}

const LessonList: React.FC<LessonListProps> = ({ module, onSelectLesson, onBack }) => {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{module.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-foreground">{module.title}</h1>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </div>
        </div>
      </header>

      {/* Progress overview */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
          <span className="text-sm font-bold text-primary">{Math.round(module.progress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${module.progress}%` }}
          />
        </div>
      </div>

      {/* Lessons list */}
      <div className="p-4">
        <div className="flex flex-col gap-3">
          {module.lessons.map((lesson, index) => {
            const isLocked = index > 0 && !module.lessons[index - 1].completed;
            const isNext = index === 0 || module.lessons[index - 1].completed;
            
            return (
              <button
                key={lesson.id}
                onClick={() => !isLocked && onSelectLesson(lesson)}
                disabled={isLocked}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                  "animate-slide-up opacity-0",
                  isLocked
                    ? "border-border bg-muted cursor-not-allowed opacity-60"
                    : lesson.completed
                    ? "border-success bg-success/5"
                    : isNext
                    ? "border-primary bg-primary/5 shadow-primary hover:shadow-lg"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                )}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isLocked
                      ? "bg-muted"
                      : lesson.completed
                      ? "bg-success"
                      : isNext
                      ? "gradient-primary"
                      : "bg-secondary"
                  )}>
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : lesson.completed ? (
                      <CheckCircle className="w-6 h-6 text-success-foreground" />
                    ) : (
                      <Play className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {lesson.content.length} items
                    </p>
                  </div>

                  {isNext && !lesson.completed && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                      START
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonList;
