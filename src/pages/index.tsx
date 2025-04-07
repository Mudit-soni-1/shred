import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CalorieSummary } from "@/components/Dashboard/CalorieSummary";
import { PRGraph } from "@/components/Dashboard/PRGraph";
import { DailyStatusCard } from "@/components/Dashboard/DailyStatusCard";
import { SleepCard } from "@/components/Dashboard/SleepCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fine } from "@/lib/fine";
import { Dumbbell, PieChart, Loader2 } from "lucide-react";
import { getRandomQuote } from "@/lib/utils";

const Index = () => {
  const { data: session, isPending } = fine.auth.useSession();
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [motivationalQuote] = useState(getRandomQuote());
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        const profiles = await fine.table("user_profiles")
          .select()
          .eq("userId", session.user.id);
        
        setHasProfile(profiles.length > 0 && profiles[0].onboardingCompleted);
      } catch (error) {
        console.error("Error checking user profile:", error);
        setHasProfile(false);
      } finally {
        setCheckingProfile(false);
      }
    };
    
    if (session?.user) {
      checkUserProfile();
    } else if (!isPending) {
      setCheckingProfile(false);
    }
  }, [session, isPending]);

  useEffect(() => {
    const fetchRecentData = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        // Fetch recent workouts
        const workouts = await fine.table("workouts")
          .select()
          .eq("userId", session.user.id)
          .order("date", { ascending: false })
          .limit(3);
        
        setRecentWorkouts(workouts || []);
      } catch (error) {
        console.error("Error fetching recent data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user && hasProfile) {
      fetchRecentData();
    } else if (!isPending && !checkingProfile) {
      setIsLoading(false);
    }
  }, [session, isPending, hasProfile, checkingProfile]);

  if (isPending || checkingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect to onboarding if logged in but no profile
  if (session?.user && hasProfile === false) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {!session ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Welcome to FitTrack
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Your all-in-one solution for tracking your fitness journey. Log your meals, track your workouts, and monitor your progress.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Track Nutrition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Log your meals and monitor your daily calorie and macro intake to stay on track with your nutrition goals.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Log Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Record your exercises, sets, and reps to track your progress and celebrate your personal records.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-primary"
                    >
                      <path d="M12 2v4" />
                      <path d="M12 18v4" />
                      <path d="M4.93 4.93l2.83 2.83" />
                      <path d="M16.24 16.24l2.83 2.83" />
                      <path d="M2 12h4" />
                      <path d="M18 12h4" />
                      <path d="M4.93 19.07l2.83-2.83" />
                      <path d="M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <CardTitle>Monitor Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize your fitness journey with progress charts and insights to stay motivated and reach your goals.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center max-w-lg">
              <p className="text-lg italic text-muted-foreground">"{motivationalQuote}"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">
              Welcome back, {session.user.name || session.user.email?.split('@')[0]}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyStatusCard />
              <SleepCard />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalorieSummary />
              <PRGraph />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/10 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-green-500" />
                    Food Tracking
                  </CardTitle>
                  <CardDescription>
                    Log your meals and track your nutrition
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-4">
                    Keep track of your daily calories and macronutrients to stay on top of your nutrition goals.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/food">Go to Food Log</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/10 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                  <CardTitle className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-blue-500" />
                    Workout Tracking
                  </CardTitle>
                  <CardDescription>
                    Log your workouts and track your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-4">
                    Record your exercises, sets, and reps to monitor your strength gains and personal records.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/workouts">Go to Workouts</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : recentWorkouts.length > 0 ? (
                  <div className="space-y-4">
                    {recentWorkouts.map(workout => (
                      <div key={workout.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">Workout on {new Date(workout.date).toLocaleDateString()}</p>
                          {workout.notes && <p className="text-sm text-muted-foreground">{workout.notes}</p>}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/workouts">View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    No recent workouts. Start logging your fitness journey!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;