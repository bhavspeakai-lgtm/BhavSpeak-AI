-- BhavSpeak AI Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    pretest_level VARCHAR(10) CHECK (pretest_level IN ('L1', 'L2', 'L3')),
    pretest_score INTEGER CHECK (pretest_score >= 0 AND pretest_score <= 100),
    pretest_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accent VARCHAR(20) DEFAULT 'american' CHECK (accent IN ('american', 'british', 'indian', 'australian')),
    level VARCHAR(20) DEFAULT 'easy' CHECK (level IN ('easy', 'medium', 'hard')),
    current_module VARCHAR(100),
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Completed Lessons Table
CREATE TABLE IF NOT EXISTS completed_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(255) NOT NULL,
    module_id VARCHAR(255) NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- Pretest Results Table
CREATE TABLE IF NOT EXISTS pretest_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(100) NOT NULL,
    transcript TEXT,
    duration INTEGER NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    level VARCHAR(10) NOT NULL CHECK (level IN ('L1', 'L2', 'L3')),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Phonetic Practice Results Table
CREATE TABLE IF NOT EXISTS phonetic_practice_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sound_id VARCHAR(50) NOT NULL,
    word_id VARCHAR(100) NOT NULL,
    user_transcript TEXT,
    is_correct BOOLEAN,
    confidence DECIMAL(5,2),
    practiced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Sentence Reading Results Table
CREATE TABLE IF NOT EXISTS sentence_reading_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(255) NOT NULL,
    sentence_id VARCHAR(255) NOT NULL,
    user_transcript TEXT,
    mistakes JSONB,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Speaking Practice Results Table
CREATE TABLE IF NOT EXISTS speaking_practice_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(255) NOT NULL,
    transcript TEXT,
    duration INTEGER NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AI Interview Results Table
CREATE TABLE IF NOT EXISTS ai_interview_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    answer_transcript TEXT,
    duration INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Final Interview Assessment Table
CREATE TABLE IF NOT EXISTS interview_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    fluency_score INTEGER CHECK (fluency_score >= 0 AND fluency_score <= 100),
    grammar_score INTEGER CHECK (grammar_score >= 0 AND grammar_score <= 100),
    vocabulary_score INTEGER CHECK (vocabulary_score >= 0 AND vocabulary_score <= 100),
    pronunciation_score INTEGER CHECK (pronunciation_score >= 0 AND pronunciation_score <= 100),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_lessons_user_id ON completed_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_pretest_results_user_id ON pretest_results(user_id);
CREATE INDEX IF NOT EXISTS idx_phonetic_practice_user_id ON phonetic_practice_results(user_id);
CREATE INDEX IF NOT EXISTS idx_sentence_reading_user_id ON sentence_reading_results(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_practice_user_id ON speaking_practice_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interview_user_id ON ai_interview_results(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_assessments_user_id ON interview_assessments(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE pretest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE phonetic_practice_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_reading_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_practice_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interview_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data (if using Supabase Auth)
-- Uncomment these if you're using Supabase Authentication
/*
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);
*/

