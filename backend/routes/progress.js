import express from 'express';
import { authenticateToken } from './auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get user progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const progressResult = await pool.query(
      `SELECT * FROM user_progress WHERE user_id = $1`,
      [userId]
    );

    const completedLessonsResult = await pool.query(
      `SELECT lesson_id, module_id, score, completed_at 
       FROM completed_lessons 
       WHERE user_id = $1 
       ORDER BY completed_at DESC`,
      [userId]
    );

    res.json({
      progress: progressResult.rows[0] || null,
      completedLessons: completedLessonsResult.rows
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user progress
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { accent, level, currentModule, xp, streak } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `UPDATE user_progress 
       SET accent = COALESCE($1, accent),
           level = COALESCE($2, level),
           current_module = COALESCE($3, current_module),
           xp = COALESCE($4, xp),
           streak = COALESCE($5, streak),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6`,
      [accent, level, currentModule, xp, streak, userId]
    );

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark lesson as completed
router.post('/lessons/complete', authenticateToken, async (req, res) => {
  try {
    const { lessonId, moduleId, score } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `INSERT INTO completed_lessons (user_id, lesson_id, module_id, score)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET score = $4, completed_at = CURRENT_TIMESTAMP`,
      [userId, lessonId, moduleId, score]
    );

    // Update XP in user_progress
    if (score) {
      await pool.query(
        `UPDATE user_progress 
         SET xp = xp + $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [score, userId]
      );
    }

    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

