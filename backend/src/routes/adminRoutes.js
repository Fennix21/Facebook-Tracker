import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', auth('admin'), async (_req, res) => {
  const users = (await pool.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC')).rows;
  res.json(users);
});

router.get('/events', auth('admin'), async (_req, res) => {
  const events = (await pool.query('SELECT * FROM behavior_events ORDER BY timestamp DESC LIMIT 300')).rows;
  res.json(events);
});

router.get('/metrics', auth('admin'), async (_req, res) => {
  const metrics = (await pool.query(`SELECT COUNT(*) as users,
    SUM(CASE WHEN streak > 0 THEN 1 ELSE 0 END) as active_streak_users,
    AVG(points) as avg_points
    FROM user_profiles`)).rows[0];
  res.json(metrics);
});

router.post('/interventions', auth('admin'), async (req, res) => {
  const { trigger_name, action_type, config } = req.body;
  const result = await pool.query('INSERT INTO intervention_rules (trigger_name, action_type, config) VALUES ($1,$2,$3) RETURNING *', [trigger_name, action_type, config]);
  res.status(201).json(result.rows[0]);
});

export default router;
