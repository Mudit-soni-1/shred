import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { Loader2, Plus, Save, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { Workout, Exercise, ExerciseSet } from "@/lib/db-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkoutFormProps {
  onWorkoutAdded: () => void;
}

// Common exercise templates by muscle group
const exerciseTemplates = {
  chest: ["Bench Press", "Incline Bench Press", "Chest Fly", "Push-Up", "Dumbbell Press"],
  back: ["Pull-Up", "Lat Pulldown", "Barbell Row", "Dumbbell Row", "Deadlift"],
  legs: ["Squat", "Leg Press", "Leg Extension", "Leg Curl", "Calf Raise"],
  shoulders: ["Overhead Press", "Lateral Raise", "Front Raise", "Face Pull", "Shrug"],
  arms: ["Bicep Curl", "Tricep Extension", "Hammer Curl", "Skull Crusher", "Chin-Up"]
};

export function WorkoutForm({ onWorkoutAdded }: WorkoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [exercises, setExercises] = useState<Array<{
    name: string;
    sets: ExerciseSet[];
    expanded: boolean;
  }>>([{ name: "", sets: [{ reps: 0, weight: 0 }], expanded: true }]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | undefined>();
  
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  const handleExerciseNameChange = (index: number, value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].name = value;
    setExercises(updatedExercises);
  };
  
  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof ExerciseSet, value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = parseFloat(value);
    setExercises(updatedExercises);
  };
  
  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setExercises(updatedExercises);
  };
  
  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
  };
  
  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: [{ reps: 0, weight: 0 }], expanded: true }]);
  };
  
  const removeExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };
  
  const toggleExerciseExpanded = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].expanded = !updatedExercises[index].expanded;
    setExercises(updatedExercises);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add workouts",
        variant: "destructive"
      });
      return;
    }
    
    // Validate exercises
    const invalidExercises = exercises.filter(ex => !ex.name || ex.sets.some(set => set.reps <= 0));
    if (invalidExercises.length > 0) {
      toast({
        title: "Error",
        description: "All exercises must have a name and valid sets",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Create workout
      const newWorkout: Workout = {
        userId: session.user.id,
        date: today,
        notes: workoutNotes || null
      };
      
      const workouts = await fine.table("workouts").insert(newWorkout).select();
      const workoutId = workouts[0].id;
      
      // Create exercises
      for (const exercise of exercises) {
        const newExercise: Exercise = {
          workoutId: workoutId!,
          name: exercise.name,
          sets: JSON.stringify(exercise.sets)
        };
        
        await fine.table("exercises").insert(newExercise);
        
        // Check for personal records
        const maxWeightSet = [...exercise.sets].sort((a, b) => b.weight - a.weight)[0];
        if (maxWeightSet && maxWeightSet.weight > 0) {
          const newPR = {
            userId: session.user.id,
            exerciseName: exercise.name,
            weight: maxWeightSet.weight,
            reps: maxWeightSet.reps,
            date: today
          };
          
          await fine.table("personal_records").insert(newPR);
        }
      }
      
      toast({
        title: "Success",
        description: "Workout logged successfully"
      });
      
      // Reset form
      setWorkoutNotes("");
      setExercises([{ name: "", sets: [{ reps: 0, weight: 0 }], expanded: true }]);
      
      // Notify parent component
      onWorkoutAdded();
    } catch (error) {
      console.error("Error adding workout:", error);
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectExercise = (exerciseIndex: number, exerciseName: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].name = exerciseName;
    setExercises(updatedExercises);
  };
  
  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
        <CardTitle className="text-xl">Log Workout</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Workout Notes</Label>
            <Textarea
              id="notes"
              placeholder="How was your workout today?"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Muscle Group</Label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chest">Chest</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="legs">Legs</SelectItem>
                  <SelectItem value="shoulders">Shoulders</SelectItem>
                  <SelectItem value="arms">Arms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedMuscleGroup && (
              <div className="flex flex-wrap gap-2">
                {exerciseTemplates[selectedMuscleGroup as keyof typeof exerciseTemplates].map((exercise, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Find first empty exercise or add new one
                      const emptyIndex = exercises.findIndex(ex => !ex.name);
                      if (emptyIndex >= 0) {
                        handleExerciseNameChange(emptyIndex, exercise);
                      } else {
                        setExercises([...exercises, { 
                          name: exercise, 
                          sets: [{ reps: 0, weight: 0 }],
                          expanded: true
                        }]);
                      }
                    }}
                  >
                    {exercise}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {exercises.map((exercise, exerciseIndex) => (
              <Card key={exerciseIndex} className="overflow-hidden border">
                <div 
                  className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer"
                  onClick={() => toggleExerciseExpanded(exerciseIndex)}
                >
                  <div className="flex items-center gap-2">
                    {exercise.expanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => handleExerciseNameChange(exerciseIndex, e.target.value)}
                      disabled={isLoading}
                      required
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {exercises.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExercise(exerciseIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                
                {exercise.expanded && (
                  <CardContent className="p-3 pt-3">
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Weight (lbs)</div>
                        <div className="col-span-4">Reps</div>
                        <div className="col-span-2"></div>
                      </div>
                      
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="grid grid-cols-12 items-center gap-2">
                          <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                          <div className="col-span-5">
                            <Input
                              type="number"
                              min="0"
                              step="2.5"
                              value={set.weight || ""}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, "weight", e.target.value)}
                              disabled={isLoading}
                              required
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              type="number"
                              min="1"
                              value={set.reps || ""}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, "reps", e.target.value)}
                              disabled={isLoading}
                              required
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            {exercise.sets.length > 1 && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeSet(exerciseIndex, setIndex)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSet(exerciseIndex)}
                        className="w-full mt-2"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Set
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addExercise}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Workout
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}