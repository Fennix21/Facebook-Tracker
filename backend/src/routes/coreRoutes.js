import express from 'express';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { logEvent } from '../services/eventService.js';
import { resolveLevel, scoreFromProfile } from '../services/levelService.js';

const router = express.Router();

router.get('/profile', auth(), async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.user.id]);
  res.json(rows[0]);
});

router.post('/objectives', auth(), async (req, res) => {
  const { title, description, deadline, subtasks } = req.body;
  const result = await pool.query(
    'INSERT INTO objectives (user_id, title, description, deadline, subtasks) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [req.user.id, title, description, deadline, subtasks || []]
  );
  res.status(201).json(result.rows[0]);
});

router.post('/checkin', auth(), async (req, res) => {
  const { expected_action, done, reason } = req.body;
  await pool.query('INSERT INTO daily_checkins (user_id, expected_action, done, reason) VALUES ($1,$2,$3,$4)', [req.user.id, expected_action, done, reason]);
  const profile = (await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.user.id])).rows[0];

  const points = done ? profile.points + 10 : Math.max(0, profile.points - 8);
  const streak = done ? profile.streak + 1 : 0;
  const penalties = done ? profile.penalties_count : profile.penalties_count + 1;
  const rewards = done ? profile.rewards_count + 1 : profile.rewards_count;
  const consistency = scoreFromProfile(streak, penalties);
  const levelData = resolveLevel(consistency);

  const blockedUntil = penalties >= 3 && !done ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  await pool.query(
    `UPDATE user_profiles
     SET points=$1, streak=$2, penalties_count=$3, rewards_count=$4,
         level=$5, last_checkin_date=NOW(), blocked_until=COALESCE($6, blocked_until)
     WHERE user_id=$7`,
    [points, streak, penalties, rewards, levelData.level, blockedUntil, req.user.id]
  );

  await logEvent(req.user.id, done ? 'checkin_completed' : 'missed_checkin', { reason, points, streak, penalties, blockedUntil });
  if (blockedUntil) await logEvent(req.user.id, 'feature_blocked', { blockedUntil });

  res.json({ points, streak, penalties, rewards, level: levelData, blockedUntil, message: done ? 'Comportamiento ejecutado y registrado.' : 'Fallo registrado. Penalización aplicada.' });
});

router.get('/dashboard', auth(), async (req, res) => {
  const profile = (await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.user.id])).rows[0];
  const objectives = (await pool.query('SELECT * FROM objectives WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id])).rows;
  const history = (await pool.query('SELECT * FROM daily_checkins WHERE user_id = $1 ORDER BY created_at DESC LIMIT 14', [req.user.id])).rows;
  res.json({ profile, objectives, history });
});

export default router;
