export type Schema = {
  food_entries: {
    id?: number;
    userId: string;
    name: string;
    calories: number;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
    date: string;
  };
  
  workouts: {
    id?: number;
    userId: string;
    date: string;
    notes?: string | null;
  };
  
  exercises: {
    id?: number;
    workoutId: number;
    name: string;
    sets: string; // JSON string of {reps: number, weight: number}[]
  };
  
  personal_records: {
    id?: number;
    userId: string;
    exerciseName: string;
    weight: number;
    reps: number;
    date: string;
  };

  user_profiles: {
    id?: number;
    userId: string;
    goal: string; // 'lose_fat', 'gain_muscle', 'maintain'
    height?: number | null;
    weight?: number | null;
    targetWeight?: number | null;
    activityLevel?: string | null; // 'sedentary', 'light', 'moderate', 'active', 'very_active'
    preferredTraining?: string | null; // 'strength', 'cardio', 'hiit', 'yoga', etc.
    onboardingCompleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  weight_logs: {
    id?: number;
    userId: string;
    weight: number;
    bodyFatPercentage?: number | null;
    date: string;
    notes?: string | null;
  };

  cardio_logs: {
    id?: number;
    userId: string;
    type: string; // 'running', 'cycling', 'swimming', etc.
    duration: number; // in minutes
    distance?: number | null; // in km or miles
    caloriesBurned?: number | null;
    date: string;
    notes?: string | null;
  };

  supplement_logs: {
    id?: number;
    userId: string;
    name: string;
    dosage?: string | null;
    timeTaken: string;
    date: string;
  };

  reminders: {
    id?: number;
    userId: string;
    type: string; // 'workout', 'meal', 'supplement', 'sleep', etc.
    title: string;
    message?: string | null;
    time: string; // time of day for the reminder
    days: string; // JSON array of days of week (0-6)
    enabled?: boolean;
  };
}

export type FoodEntry = Schema['food_entries'];
export type Workout = Schema['workouts'];
export type Exercise = Schema['exercises'] & { 
  parsedSets?: Array<{reps: number, weight: number}> 
};
export type PersonalRecord = Schema['personal_records'];
export type UserProfile = Schema['user_profiles'];
export type WeightLog = Schema['weight_logs'];
export type CardioLog = Schema['cardio_logs'];
export type SupplementLog = Schema['supplement_logs'];
export type Reminder = Schema['reminders'];

export interface ExerciseSet {
  reps: number;
  weight: number;
}

export type FitnessGoal = 'lose_fat' | 'gain_muscle' | 'maintain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type TrainingPreference = 'strength' | 'cardio' | 'hiit' | 'yoga' | 'calisthenics' | 'crossfit' | 'other';