import React, { useState } from 'react';
import { LearningProvider, useLearning } from '@/context/LearningContext';
import Header from '@/components/Header';
import ModulePath from '@/components/ModulePath';
import LessonList from '@/components/LessonList';
import LessonView from '@/components/LessonView';
import { Module, Lesson } from '@/types/learning';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type View = 'home' | 'module' | 'lesson';

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { user, logout } = useAuth();
  
  const { 
    userProgress, 
    modules, 
    completeLesson, 
    addXP,
    unlockNextModule 
  } = useLearning();
  const { toast } = useToast();

  const handleSelectModule = (module: Module) => {
    setSelectedModule(module);
    setView('module');
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView('lesson');
  };

  const handleLessonComplete = (lessonId: string, xpEarned: number) => {
    completeLesson(lessonId);
    addXP(xpEarned);
    
    // Check if module is complete
    if (selectedModule) {
      const allLessonsComplete = selectedModule.lessons.every(
        (l) => l.completed || l.id === lessonId
      );
      if (allLessonsComplete) {
        unlockNextModule(selectedModule.id);
        toast({
          title: "Module Complete! 🏆",
          description: `You've mastered ${selectedModule.title}! New module unlocked.`,
        });
      }
    }
    
    setView('module');
    setSelectedLesson(null);
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleBackToModule = () => {
    setView('module');
    setSelectedLesson(null);
  };

  const handleSettingsClick = () => {
    logout();
  };

  if (view === 'lesson' && selectedModule && selectedLesson) {
    return (
      <LessonView
        module={selectedModule}
        lesson={selectedLesson}
        accent={userProgress.accent}
        onComplete={handleLessonComplete}
        onBack={handleBackToModule}
      />
    );
  }

  if (view === 'module' && selectedModule) {
    return (
      <LessonList
        module={selectedModule}
        onSelectLesson={handleSelectLesson}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Header onSettingsClick={handleSettingsClick} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.fullName}! 👋
          </h1>
          {user?.pretestLevel && (
            <p className="text-muted-foreground">
              Level {user.pretestLevel} • Score: {user.pretestScore}/100
            </p>
          )}
          <p className="text-muted-foreground mt-2">
            Complete each module to unlock the next one
          </p>
        </div>
        
        <ModulePath
          modules={modules}
          onSelectModule={handleSelectModule}
          currentModuleId={userProgress.currentModule}
        />
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
};

export default Index;
