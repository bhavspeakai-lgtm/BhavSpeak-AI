import { PretestLevel } from './auth';

export type Accent = 'american' | 'british' | 'indian' | 'australian';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Map pretest levels to difficulty levels
export const PRETEST_TO_DIFFICULTY: Record<PretestLevel, DifficultyLevel> = {
  L1: 'hard',   // Advanced
  L2: 'medium', // Intermediate
  L3: 'easy',   // Beginner
};

export type ModuleType = 'alphabets' | 'words' | 'sentences' | 'paragraphs';

export interface Module {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  isLocked: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: LessonContent[];
  completed: boolean;
}

export interface LessonContent {
  id: string;
  text: string;
  phonetic?: string;
  audioUrl?: string;
}

export interface UserProgress {
  accent: Accent;
  level: DifficultyLevel;
  currentModule: string;
  completedLessons: string[];
  xp: number;
  streak: number;
}

export interface PronunciationResult {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
  correctPronunciation?: string;
}

export const ACCENTS: { id: Accent; name: string; flag: string; description: string }[] = [
  { id: 'american', name: 'American English', flag: '🇺🇸', description: 'Standard US pronunciation' },
  { id: 'british', name: 'British English', flag: '🇬🇧', description: 'Received Pronunciation (RP)' },
  { id: 'indian', name: 'Indian English', flag: '🇮🇳', description: 'Indian English accent' },
  { id: 'australian', name: 'Australian English', flag: '🇦🇺', description: 'Aussie English mate!' },
];

export const DIFFICULTY_LEVELS: { id: DifficultyLevel; name: string; description: string; color: string }[] = [
  { id: 'easy', name: 'Beginner', description: 'Start from basics', color: 'success' },
  { id: 'medium', name: 'Intermediate', description: 'Build your skills', color: 'warning' },
  { id: 'hard', name: 'Advanced', description: 'Master the language', color: 'destructive' },
];
