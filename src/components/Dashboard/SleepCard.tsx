import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

export function SleepCard() {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(4);
  
  const sleepPercentage = (sleepHours / 9) * 100;
  const sleepColor = sleepHours < 6 
    ? "bg-red-500" 
    : sleepHours < 7 
    ? "bg-yellow-500" 
    : "bg-green-500";
  
  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-500" />
          <span>Sleep Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sleep Duration</span>
            <span className="font-medium">{sleepHours} hours</span>
          </div>
          <Progress value={sleepPercentage} className="h-2" indicatorColor={sleepColor} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not Enough</span>
            <span>Optimal</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Sleep Quality</span>
            <span className="font-medium">{sleepQuality}/5</span>
          </div>
          <Slider 
            value={[sleepQuality]} 
            min={1} 
            max={5} 
            step={1} 
            onValueChange={(value) => setSleepQuality(value[0])}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Bedtime</span>
          </div>
          <span className="font-medium">11:30 PM</span>
        </div>
        
        <div className="flex justify-between items-center">
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
              className="text-muted-foreground"
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
            <span className="text-muted-foreground">Wake up</span>
          </div>
          <span className="font-medium">7:00 AM</span>
        </div>
      </CardContent>
    </Card>
  );
}