import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { logEvent } from '../services/eventService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, role',
    [email, hash, name]
  );
  await pool.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [result.rows[0].id]);
  res.status(201).json(result.rows[0]);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  await logEvent(user.id, 'login');
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: user.role });
});

router.post('/recover', async (_req, res) => {
  res.json({ message: 'Flujo de recuperación iniciado (placeholder)' });
});

export default router;
