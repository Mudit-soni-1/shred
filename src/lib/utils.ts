import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to display in a user-friendly format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
}

// Calculate calories burned based on workout duration and intensity
export function calculateCaloriesBurned(durationMinutes: number, intensity: 'low' | 'medium' | 'high', weightKg: number): number {
  const metValues = {
    low: 3.5,
    medium: 7,
    high: 10
  };
  
  // Formula: calories = MET * weight in kg * duration in hours
  return Math.round(metValues[intensity] * weightKg * (durationMinutes / 60));
}

// Generate a random motivational quote
export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The hardest lift of all is lifting your butt off the couch.",
  "Don't wish for it, work for it.",
  "Sweat is just fat crying.",
  "You don't have to be extreme, just consistent.",
  "The only way to define your limits is by going beyond them.",
  "Your health is an investment, not an expense."
];

export function getRandomQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}