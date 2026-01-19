import React from 'react';
import { Module } from '@/types/learning';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle } from 'lucide-react';

interface ModulePathProps {
  modules: Module[];
  onSelectModule: (module: Module) => void;
  currentModuleId: string;
}

const ModulePath: React.FC<ModulePathProps> = ({ modules, onSelectModule, currentModuleId }) => {
  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 rounded-full" />
        
        <div className="relative flex flex-col gap-6">
          {modules.map((module, index) => {
            const isCompleted = module.progress === 100;
            const isCurrent = module.id === currentModuleId;
            const isLocked = module.isLocked;
            
            return (
              <div
                key={module.id}
                className={cn(
                  "relative flex items-center",
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* Module Card */}
                <button
                  onClick={() => !isLocked && onSelectModule(module)}
                  disabled={isLocked}
                  className={cn(
                    "w-[calc(50%-2rem)] p-4 rounded-2xl border-2 transition-all duration-300",
                    "animate-slide-up opacity-0",
                    isLocked 
                      ? "border-border bg-muted cursor-not-allowed opacity-60"
                      : isCurrent
                      ? "border-primary bg-primary/5 shadow-primary hover:shadow-lg"
                      : isCompleted
                      ? "border-success bg-success/5 hover:shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                  )}
                  style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{module.icon}</span>
                    <div className="text-left">
                      <h3 className="font-bold text-foreground">{module.title}</h3>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  {!isLocked && (
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isCompleted ? "bg-success" : "gradient-primary"
                        )}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  )}
                </button>
                
                {/* Center node */}
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300",
                    isLocked
                      ? "border-muted bg-muted"
                      : isCompleted
                      ? "border-success bg-success"
                      : isCurrent
                      ? "border-primary bg-primary animate-pulse-glow"
                      : "border-border bg-card"
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-success-foreground" />
                  ) : (
                    <span className="text-lg font-bold text-foreground">{index + 1}</span>
                  )}
                </div>
                
                {/* Spacer */}
                <div className="w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModulePath;
