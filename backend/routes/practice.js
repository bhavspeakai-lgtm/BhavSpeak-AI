import express from 'express';
import { authenticateToken } from './auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Save phonetic practice result
router.post('/phonetic', authenticateToken, async (req, res) => {
  try {
    const { soundId, wordId, userTranscript, isCorrect, confidence } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `INSERT INTO phonetic_practice_results (user_id, sound_id, word_id, user_transcript, is_correct, confidence)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, soundId, wordId, userTranscript, isCorrect, confidence]
    );

    res.json({ message: 'Phonetic practice result saved' });
  } catch (error) {
    console.error('Phonetic practice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save sentence reading result
router.post('/sentence-reading', authenticateToken, async (req, res) => {
  try {
    const { lessonId, sentenceId, userTranscript, mistakes, score } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `INSERT INTO sentence_reading_results (user_id, lesson_id, sentence_id, user_transcript, mistakes, score)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, lessonId, sentenceId, userTranscript, JSON.stringify(mistakes), score]
    );

    res.json({ message: 'Sentence reading result saved' });
  } catch (error) {
    console.error('Sentence reading error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save speaking practice result
router.post('/speaking', authenticateToken, async (req, res) => {
  try {
    const { topicId, transcript, duration, score, feedback } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `INSERT INTO speaking_practice_results (user_id, topic_id, transcript, duration, score, feedback)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, topicId, transcript, duration, score, feedback]
    );

    res.json({ message: 'Speaking practice result saved' });
  } catch (error) {
    console.error('Speaking practice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save AI interview answer
router.post('/interview/answer', authenticateToken, async (req, res) => {
  try {
    const { questionId, answerTranscript, duration } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `INSERT INTO ai_interview_results (user_id, question_id, answer_transcript, duration)
       VALUES ($1, $2, $3, $4)`,
      [userId, questionId, answerTranscript, duration]
    );

    res.json({ message: 'Interview answer saved' });
  } catch (error) {
    console.error('Interview answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save final interview assessment
router.post('/interview/assessment', authenticateToken, async (req, res) => {
  try {
    const { overallScore, fluencyScore, grammarScore, vocabularyScore, pronunciationScore, feedback } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO interview_assessments 
       (user_id, overall_score, fluency_score, grammar_score, vocabulary_score, pronunciation_score, feedback)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [userId, overallScore, fluencyScore, grammarScore, vocabularyScore, pronunciationScore, feedback]
    );

    res.json({
      message: 'Interview assessment saved',
      assessment: result.rows[0]
    });
  } catch (error) {
    console.error('Interview assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

