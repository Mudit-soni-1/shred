import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Droplet, Moon, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { getRandomQuote } from "@/lib/utils";

export function DailyStatusCard() {
  const [gymDone, setGymDone] = useState(false);
  const [cardioDone, setCardioDone] = useState(false);
  const [waterIntake, setWaterIntake] = useState(3); // Out of 8 glasses
  const [mood, setMood] = useState(4); // 1-5 scale
  const [energy, setEnergy] = useState(3); // 1-5 scale
  const [quote] = useState(getRandomQuote());
  
  const waterPercentage = (waterIntake / 8) * 100;
  
  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Today's Status</span>
          <span className="text-sm font-normal text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex gap-3">
          <Button 
            variant={gymDone ? "default" : "outline"} 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => setGymDone(!gymDone)}
          >
            <Dumbbell className={`h-4 w-4 ${gymDone ? "text-primary-foreground" : "text-primary"}`} />
            {gymDone ? "Gym Done ✓" : "Gym"}
          </Button>
          
          <Button 
            variant={cardioDone ? "default" : "outline"} 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => setCardioDone(!cardioDone)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`${cardioDone ? "text-primary-foreground" : "text-primary"}`}
            >
              <path d="M19 8v3m0 0v3m0-3h3m-3 0h-3" />
              <path d="M2 8h6l2-2h4l2 2h6" />
              <path d="M3.2 14.65a9 9 0 0 0 17.6 0" />
            </svg>
            {cardioDone ? "Cardio Done ✓" : "Cardio"}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span>Water Intake</span>
            </div>
            <span className="font-medium">{waterIntake}/8 glasses</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={waterPercentage} className="h-2" indicatorColor="bg-blue-500" />
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={() => setWaterIntake(prev => Math.min(prev + 1, 8))}
            >
              +
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Mood</span>
              <span className="ml-auto font-medium">{mood}/5</span>
            </div>
            <Slider 
              value={[mood]} 
              min={1} 
              max={5} 
              step={1} 
              onValueChange={(value) => setMood(value[0])}
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😔</span>
              <span>😊</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-yellow-500"
              >
                <path d="M12 2v8" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="m8 6 4-4 4 4" />
                <path d="M16 18a4 4 0 0 0-8 0" />
              </svg>
              <span>Energy</span>
              <span className="ml-auto font-medium">{energy}/5</span>
            </div>
            <Slider 
              value={[energy]} 
              min={1} 
              max={5} 
              step={1} 
              onValueChange={(value) => setEnergy(value[0])}
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="text-sm italic text-center text-muted-foreground">
            "{quote}"
          </div>
        </div>
      </CardContent>
    </Card>
  );
}