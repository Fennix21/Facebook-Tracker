import pool from '../config/db.js';

export async function logEvent(userId, eventName, metadata = {}) {
  await pool.query(
    'INSERT INTO behavior_events (user_id, event_name, metadata) VALUES ($1, $2, $3)',
    [userId, eventName, metadata]
  );
}
