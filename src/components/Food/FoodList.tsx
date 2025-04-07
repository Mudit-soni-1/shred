import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fine } from "@/lib/fine";
import type { FoodEntry } from "@/lib/db-types";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodListProps {
  refreshTrigger: number;
}

export function FoodList({ refreshTrigger }: FoodListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    const fetchFoodEntries = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const entries = await fine.table("food_entries")
          .select()
          .eq("userId", session.user.id)
          .eq("date", today);
        
        setFoodEntries(entries || []);
      } catch (error) {
        console.error("Error fetching food entries:", error);
        toast({
          title: "Error",
          description: "Failed to load food entries",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodEntries();
  }, [session, refreshTrigger, toast]);
  
  const handleDelete = async (id: number) => {
    if (!session?.user) return;
    
    try {
      await fine.table("food_entries").delete().eq("id", id);
      
      // Update local state
      setFoodEntries(prev => prev.filter(entry => entry.id !== id));
      
      toast({
        title: "Success",
        description: "Food entry deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete food entry",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Food Log</CardTitle>
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
        <CardTitle>Today's Food Log</CardTitle>
      </CardHeader>
      <CardContent>
        {foodEntries.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No food entries for today. Add some food to get started!
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 font-medium text-sm border-b pb-2">
              <div className="col-span-4">Food</div>
              <div className="col-span-2 text-right">Calories</div>
              <div className="col-span-2 text-right">Protein</div>
              <div className="col-span-2 text-right">Carbs</div>
              <div className="col-span-1 text-right">Fat</div>
              <div className="col-span-1"></div>
            </div>
            
            {foodEntries.map(entry => (
              <div key={entry.id} className="grid grid-cols-12 items-center py-2 border-b last:border-0">
                <div className="col-span-4 font-medium">{entry.name}</div>
                <div className="col-span-2 text-right">{entry.calories} kcal</div>
                <div className="col-span-2 text-right">{entry.protein || 0}g</div>
                <div className="col-span-2 text-right">{entry.carbs || 0}g</div>
                <div className="col-span-1 text-right">{entry.fat || 0}g</div>
                <div className="col-span-1 text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => entry.id && handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Summary row */}
            <div className="grid grid-cols-12 items-center pt-2 font-medium">
              <div className="col-span-4">Total</div>
              <div className="col-span-2 text-right">
                {foodEntries.reduce((sum, entry) => sum + entry.calories, 0)} kcal
              </div>
              <div className="col-span-2 text-right">
                {foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0)}g
              </div>
              <div className="col-span-2 text-right">
                {foodEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0)}g
              </div>
              <div className="col-span-1 text-right">
                {foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0)}g
              </div>
              <div className="col-span-1"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}