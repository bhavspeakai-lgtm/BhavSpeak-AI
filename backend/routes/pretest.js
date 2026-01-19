import express from 'express';
import { authenticateToken } from './auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Save pretest result
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { topicId, transcript, duration, score, level, feedback } = req.body;
    const userId = req.user.userId;

    // Save pretest result
    const result = await pool.query(
      `INSERT INTO pretest_results (user_id, topic_id, transcript, duration, score, level, feedback)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [userId, topicId, transcript, duration, score, level, feedback]
    );

    // Update user with pretest results
    await pool.query(
      `UPDATE users 
       SET pretest_level = $1, pretest_score = $2, pretest_completed = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [level, score, userId]
    );

    res.json({
      message: 'Pretest result saved successfully',
      result: result.rows[0]
    });
  } catch (error) {
    console.error('Pretest submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pretest result for user
router.get('/result', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM pretest_results 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No pretest result found' });
    }

    res.json({ result: result.rows[0] });
  } catch (error) {
    console.error('Get pretest result error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

