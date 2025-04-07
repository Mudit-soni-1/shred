import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import type { PersonalRecord } from "@/lib/db-types";
import { Loader2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PRListProps {
  refreshTrigger: number;
}

export function PRList({ refreshTrigger }: PRListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    const fetchPersonalRecords = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        // Get all PRs
        const allRecords = await fine.table("personal_records")
          .select()
          .eq("userId", session.user.id);
        
        // Group by exercise and find the max weight for each
        const exerciseMap = new Map<string, PersonalRecord>();
        
        allRecords.forEach(record => {
          const existing = exerciseMap.get(record.exerciseName);
          
          if (!existing || record.weight > existing.weight || 
              (record.weight === existing.weight && record.reps > existing.reps)) {
            exerciseMap.set(record.exerciseName, record);
          }
        });
        
        // Convert map to array and sort by weight (descending)
        const bestRecords = Array.from(exerciseMap.values())
          .sort((a, b) => b.weight - a.weight);
        
        setPersonalRecords(bestRecords);
      } catch (error) {
        console.error("Error fetching personal records:", error);
        toast({
          title: "Error",
          description: "Failed to load personal records",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPersonalRecords();
  }, [session, refreshTrigger, toast]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Personal Records
          </CardTitle>
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
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {personalRecords.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No personal records yet. Log your workouts to track your PRs!
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 font-medium text-sm border-b pb-2">
              <div className="col-span-5">Exercise</div>
              <div className="col-span-3 text-right">Weight</div>
              <div className="col-span-2 text-right">Reps</div>
              <div className="col-span-2 text-right">Date</div>
            </div>
            
            {personalRecords.map(record => (
              <div key={record.id} className="grid grid-cols-12 items-center py-2 border-b last:border-0">
                <div className="col-span-5 font-medium">{record.exerciseName}</div>
                <div className="col-span-3 text-right">{record.weight} lbs</div>
                <div className="col-span-2 text-right">{record.reps}</div>
                <div className="col-span-2 text-right text-sm text-muted-foreground">
                  {new Date(record.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}