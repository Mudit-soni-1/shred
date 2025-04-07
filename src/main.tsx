import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import FoodPage from "./pages/food";
import WorkoutsPage from "./pages/workouts";
import ProfilePage from "./pages/profile";
import OnboardingPage from "./pages/onboarding";
import SleepMoodPage from "./pages/sleep-mood";
import CardioPage from "./pages/cardio";
import RemindersPage from "./pages/reminders";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignupForm />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/onboarding' element={<OnboardingPage />} />
            <Route path='/food' element={<FoodPage />} />
            <Route path='/workouts' element={<WorkoutsPage />} />
            <Route path='/sleep-mood' element={<SleepMoodPage />} />
            <Route path='/cardio' element={<CardioPage />} />
            <Route path='/reminders' element={<RemindersPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);