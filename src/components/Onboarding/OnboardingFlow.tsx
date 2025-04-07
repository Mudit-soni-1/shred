import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { Loader2, ArrowRight, ArrowLeft, Dumbbell, Scale, Target, Activity } from "lucide-react";
import type { FitnessGoal, ActivityLevel, TrainingPreference, UserProfile } from "@/lib/db-types";

const steps = [
  "welcome",
  "goals",
  "metrics",
  "activity",
  "training",
  "complete"
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    goal: "maintain",
    height: undefined,
    weight: undefined,
    targetWeight: undefined,
    activityLevel: "moderate",
    preferredTraining: "strength",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    
    try {
      // Save user profile
      const userProfile: UserProfile = {
        userId: session.user.id,
        goal: formData.goal as FitnessGoal,
        height: formData.height || null,
        weight: formData.weight || null,
        targetWeight: formData.targetWeight || null,
        activityLevel: formData.activityLevel as ActivityLevel || null,
        preferredTraining: formData.preferredTraining as TrainingPreference || null,
        onboardingCompleted: true
      };
      
      await fine.table("user_profiles").insert(userProfile);
      
      // If weight is provided, also log it
      if (formData.weight) {
        const today = new Date().toISOString().split('T')[0];
        await fine.table("weight_logs").insert({
          userId: session.user.id,
          weight: formData.weight,
          date: today
        });
      }
      
      toast({
        title: "Setup complete!",
        description: "Your profile has been created successfully."
      });
      
      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (steps[currentStep]) {
      case "welcome":
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Welcome to FitTrack</CardTitle>
              <CardDescription className="text-lg">
                Let's set up your profile to personalize your fitness journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <p className="text-center text-muted-foreground mb-6">
                We'll ask you a few questions to help customize your experience and set you up for success.
              </p>
              <div className="w-full max-w-xs">
                <Button onClick={handleNext} className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        );
        
      case "goals":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Set Your Fitness Goal
              </CardTitle>
              <CardDescription>
                What's your primary fitness goal right now?
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <RadioGroup
                value={formData.goal}
                onValueChange={(value) => setFormData({ ...formData, goal: value })}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="lose_fat" id="lose_fat" />
                  <Label htmlFor="lose_fat" className="flex-1 cursor-pointer">
                    <div className="font-medium">Lose Fat</div>
                    <div className="text-sm text-muted-foreground">
                      Focus on reducing body fat while maintaining muscle mass
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="gain_muscle" id="gain_muscle" />
                  <Label htmlFor="gain_muscle" className="flex-1 cursor-pointer">
                    <div className="font-medium">Gain Muscle</div>
                    <div className="text-sm text-muted-foreground">
                      Focus on building muscle mass and strength
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="maintain" id="maintain" />
                  <Label htmlFor="maintain" className="flex-1 cursor-pointer">
                    <div className="font-medium">Maintain</div>
                    <div className="text-sm text-muted-foreground">
                      Maintain current physique while improving overall fitness
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case "metrics":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5 text-primary" />
                Your Body Metrics
              </CardTitle>
              <CardDescription>
                Let's get some basic measurements to track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height || ""}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || undefined })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight || ""}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="65"
                  value={formData.targetWeight || ""}
                  onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || undefined })}
                />
                <p className="text-xs text-muted-foreground">
                  This helps us calculate your calorie goals
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case "activity":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Activity Level
              </CardTitle>
              <CardDescription>
                How active are you in your daily life?
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">
                    Sedentary (Little to no exercise)
                  </SelectItem>
                  <SelectItem value="light">
                    Light (Light exercise 1-3 days/week)
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderate (Moderate exercise 3-5 days/week)
                  </SelectItem>
                  <SelectItem value="active">
                    Active (Hard exercise 6-7 days/week)
                  </SelectItem>
                  <SelectItem value="very_active">
                    Very Active (Hard daily exercise & physical job)
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-8 space-y-4">
                <p className="text-sm font-medium">Weekly Exercise Hours</p>
                <Slider
                  defaultValue={[5]}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h</span>
                  <span>5h</span>
                  <span>10h</span>
                  <span>15h</span>
                  <span>20h+</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case "training":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-primary" />
                Training Preference
              </CardTitle>
              <CardDescription>
                What type of training do you prefer?
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <RadioGroup
                value={formData.preferredTraining}
                onValueChange={(value) => setFormData({ ...formData, preferredTraining: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="strength" id="strength" />
                  <Label htmlFor="strength" className="cursor-pointer">Strength Training</Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="cardio" id="cardio" />
                  <Label htmlFor="cardio" className="cursor-pointer">Cardio</Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="hiit" id="hiit" />
                  <Label htmlFor="hiit" className="cursor-pointer">HIIT</Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="yoga" id="yoga" />
                  <Label htmlFor="yoga" className="cursor-pointer">Yoga</Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="calisthenics" id="calisthenics" />
                  <Label htmlFor="calisthenics" className="cursor-pointer">Calisthenics</Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="crossfit" id="crossfit" />
                  <Label htmlFor="crossfit" className="cursor-pointer">CrossFit</Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
        
      case "complete":
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <CardTitle className="text-2xl">You're all set!</CardTitle>
              <CardDescription className="text-lg">
                Your profile has been created and we're ready to help you reach your fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <p className="text-center text-muted-foreground mb-8">
                We've personalized your dashboard based on your goals and preferences. Let's start your fitness journey!
              </p>
              <div className="w-full max-w-xs">
                <Button 
                  onClick={handleComplete} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Go to Dashboard"
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 p-4">
      <Card className="w-full max-w-lg">
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {renderStep()}
        </div>
      </Card>
    </div>
  );
}