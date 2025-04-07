-- Create food entries table
CREATE TABLE food_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein REAL,
  carbs REAL,
  fat REAL,
  date TEXT NOT NULL
);

-- Create workouts table
CREATE TABLE workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT
);

-- Create exercises table
CREATE TABLE exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workoutId INTEGER NOT NULL,
  name TEXT NOT NULL,
  sets TEXT NOT NULL, -- JSON array of {reps, weight}
  FOREIGN KEY (workoutId) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Create personal records table
CREATE TABLE personal_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  exerciseName TEXT NOT NULL,
  weight REAL NOT NULL,
  reps INTEGER NOT NULL,
  date TEXT NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX idx_food_entries_userId_date ON food_entries(userId, date);
CREATE INDEX idx_workouts_userId ON workouts(userId);
CREATE INDEX idx_personal_records_userId ON personal_records(userId);