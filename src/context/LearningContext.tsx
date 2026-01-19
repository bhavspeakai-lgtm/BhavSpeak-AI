import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Accent, DifficultyLevel, UserProgress, Module, PRETEST_TO_DIFFICULTY } from '@/types/learning';
import { getStructuredModules } from '@/data/structuredLessons';
import { useAuth } from './AuthContext';

interface LearningContextType {
  userProgress: UserProgress;
  modules: Module[];
  setAccent: (accent: Accent) => void;
  setLevel: (level: DifficultyLevel) => void;
  completeLesson: (lessonId: string) => void;
  addXP: (amount: number) => void;
  getCurrentModule: () => Module | undefined;
  unlockNextModule: (currentModuleId: string) => void;
}

const defaultProgress: UserProgress = {
  accent: 'american',
  level: 'easy',
  currentModule: 'alphabets',
  completedLessons: [],
  xp: 0,
  streak: 1,
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);
  const [modules, setModules] = useState<Module[]>(getStructuredModules());

  // Initialize level from user's pretest level
  useEffect(() => {
    if (user?.pretestLevel) {
      const difficultyLevel = PRETEST_TO_DIFFICULTY[user.pretestLevel];
      setUserProgress((prev) => ({ ...prev, level: difficultyLevel }));
      // Use structured modules regardless of level - progression is based on completion
      setModules(getStructuredModules());
    } else {
      // Default to structured modules
      setModules(getStructuredModules());
    }
  }, [user?.pretestLevel]);

  const setAccent = useCallback((accent: Accent) => {
    setUserProgress((prev) => ({ ...prev, accent }));
  }, []);

  const setLevel = useCallback((level: DifficultyLevel) => {
    setUserProgress((prev) => ({ ...prev, level }));
    setModules(getModules(level));
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, lessonId])],
    }));

    setModules((prev) =>
      prev.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        ),
        progress: module.lessons.filter((l) => l.completed || l.id === lessonId).length / module.lessons.length * 100,
      }))
    );
  }, []);

  const addXP = useCallback((amount: number) => {
    setUserProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const getCurrentModule = useCallback(() => {
    return modules.find((m) => m.id === userProgress.currentModule);
  }, [modules, userProgress.currentModule]);

  const unlockNextModule = useCallback((currentModuleId: string) => {
    setModules((prev) => {
      const currentIndex = prev.findIndex((m) => m.id === currentModuleId);
      if (currentIndex !== -1 && currentIndex < prev.length - 1) {
        const updated = [...prev];
        updated[currentIndex + 1] = { ...updated[currentIndex + 1], isLocked: false };
        return updated;
      }
      return prev;
    });
  }, []);

  return (
    <LearningContext.Provider
      value={{
        userProgress,
        modules,
        setAccent,
        setLevel,
        completeLesson,
        addXP,
        getCurrentModule,
        unlockNextModule,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
