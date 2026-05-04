CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  penalties_count INT NOT NULL DEFAULT 0,
  rewards_count INT NOT NULL DEFAULT 0,
  last_checkin_date DATE,
  blocked_until TIMESTAMP
);

CREATE TABLE objectives (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  subtasks JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'activo',
  consistency_score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_checkins (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  expected_action TEXT NOT NULL,
  done BOOLEAN NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE behavior_events (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE intervention_rules (
  id SERIAL PRIMARY KEY,
  trigger_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
