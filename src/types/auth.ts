export type PretestLevel = 'L1' | 'L2' | 'L3';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  fullName: string;
  dob: string; // ISO date string
  gender: Gender;
  email: string;
  phoneNumber: string;
  password: string; // In production, this should be hashed
  pretestLevel?: PretestLevel;
  pretestScore?: number;
  pretestCompleted: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupData {
  fullName: string;
  dob: string;
  gender: Gender;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PretestTopic {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface PretestResult {
  score: number;
  level: PretestLevel;
  feedback: string;
  transcript: string;
  duration: number; // in seconds
}

