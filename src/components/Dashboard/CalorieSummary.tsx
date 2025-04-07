import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fine } from "@/lib/fine";
import type { FoodEntry } from "@/lib/db-types";
import { Loader2 } from "lucide-react";

interface MacroSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65
};

export function CalorieSummary() {
  const [isLoading, setIsLoading] = useState(true);
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);
  const [macroSummary, setMacroSummary] = useState<MacroSummary>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    const fetchTodayFood = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const entries = await fine.table("food_entries")
          .select()
          .eq("userId", session.user.id)
          .eq("date", today);
        
        setTodayEntries(entries || []);
        
        // Calculate totals
        const summary = entries.reduce((acc, entry) => {
          return {
            calories: acc.calories + entry.calories,
            protein: acc.protein + (entry.protein || 0),
            carbs: acc.carbs + (entry.carbs || 0),
            fat: acc.fat + (entry.fat || 0)
          };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        
        setMacroSummary(summary);
      } catch (error) {
        console.error("Error fetching food entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTodayFood();
  }, [session]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Calories</span>
            <span className="font-medium">{macroSummary.calories} / {DEFAULT_GOALS.calories} kcal</span>
          </div>
          <Progress value={(macroSummary.calories / DEFAULT_GOALS.calories) * 100} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Protein</div>
            <div className="font-medium">{macroSummary.protein}g</div>
            <Progress value={(macroSummary.protein / DEFAULT_GOALS.protein) * 100} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Carbs</div>
            <div className="font-medium">{macroSummary.carbs}g</div>
            <Progress value={(macroSummary.carbs / DEFAULT_GOALS.carbs) * 100} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Fat</div>
            <div className="font-medium">{macroSummary.fat}g</div>
            <Progress value={(macroSummary.fat / DEFAULT_GOALS.fat) * 100} className="h-1" />
          </div>
        </div>
        
        {todayEntries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No food entries for today. Add some food to track your nutrition!
          </p>
        )}
      </CardContent>
    </Card>
  );
}