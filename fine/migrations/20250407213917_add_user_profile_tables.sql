-- Create user profiles table for storing user goals and metrics
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL UNIQUE,
  goal TEXT NOT NULL, -- 'lose_fat', 'gain_muscle', 'maintain'
  height REAL,
  weight REAL,
  targetWeight REAL,
  activityLevel TEXT, -- 'sedentary', 'light', 'moderate', 'active', 'very_active'
  preferredTraining TEXT, -- 'strength', 'cardio', 'hiit', 'yoga', etc.
  onboardingCompleted BOOLEAN DEFAULT FALSE,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create weight logs table for tracking weight changes
CREATE TABLE weight_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  weight REAL NOT NULL,
  bodyFatPercentage REAL,
  date TEXT NOT NULL,
  notes TEXT
);

-- Create cardio logs table
CREATE TABLE cardio_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  type TEXT NOT NULL, -- 'running', 'cycling', 'swimming', etc.
  duration INTEGER NOT NULL, -- in minutes
  distance REAL, -- in km or miles
  caloriesBurned INTEGER,
  date TEXT NOT NULL,
  notes TEXT
);

-- Create supplement logs table
CREATE TABLE supplement_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  timeTaken TEXT NOT NULL,
  date TEXT NOT NULL
);

-- Create reminders table
CREATE TABLE reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  type TEXT NOT NULL, -- 'workout', 'meal', 'supplement', 'sleep', etc.
  title TEXT NOT NULL,
  message TEXT,
  time TEXT NOT NULL, -- time of day for the reminder
  days TEXT NOT NULL, -- JSON array of days of week (0-6)
  enabled BOOLEAN DEFAULT TRUE
);

-- Create indexes
CREATE INDEX idx_user_profiles_userId ON user_profiles(userId);
CREATE INDEX idx_weight_logs_userId_date ON weight_logs(userId, date);
CREATE INDEX idx_cardio_logs_userId_date ON cardio_logs(userId, date);
CREATE INDEX idx_supplement_logs_userId_date ON supplement_logs(userId, date);
CREATE INDEX idx_reminders_userId ON reminders(userId);