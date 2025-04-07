import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import type { PersonalRecord } from "@/lib/db-types";
import { Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PRGraph() {
  const [isLoading, setIsLoading] = useState(true);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    const fetchPersonalRecords = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        const records = await fine.table("personal_records")
          .select()
          .eq("userId", session.user.id)
          .order("date", { ascending: true });
        
        setPersonalRecords(records || []);
        
        // Extract unique exercise names
        const uniqueExercises = Array.from(new Set(records.map(record => record.exerciseName)));
        setExercises(uniqueExercises);
        
        if (uniqueExercises.length > 0) {
          setSelectedExercise(uniqueExercises[0]);
        }
      } catch (error) {
        console.error("Error fetching personal records:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPersonalRecords();
  }, [session]);
  
  useEffect(() => {
    if (selectedExercise) {
      // Filter records for the selected exercise
      const filteredRecords = personalRecords.filter(
        record => record.exerciseName === selectedExercise
      );
      
      // Format data for the chart
      const formattedData = filteredRecords.map(record => ({
        date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: record.weight,
        reps: record.reps
      }));
      
      setChartData(formattedData);
    }
  }, [selectedExercise, personalRecords]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PR Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PR Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No personal records yet. Add workouts to track your progress!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>PR Progress</CardTitle>
        <Select value={selectedExercise} onValueChange={setSelectedExercise}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map(exercise => (
              <SelectItem key={exercise} value={exercise}>
                {exercise}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (lbs)" />
                <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No data available for {selectedExercise}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}