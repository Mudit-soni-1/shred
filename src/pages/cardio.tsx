import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2, Timer, Route, Flame } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import type { CardioLog } from "@/lib/db-types";

const CardioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "running",
    duration: "",
    distance: "",
    caloriesBurned: "",
    notes: ""
  });
  
  const { toast } = useToast();
  const { data: session, isPending } = fine.auth.useSession();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add cardio sessions",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.type || !formData.duration) {
      toast({
        title: "Error",
        description: "Cardio type and duration are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const newCardioLog: CardioLog = {
        userId: session.user.id,
        type: formData.type,
        duration: parseInt(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : null,
        caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : null,
        date: today,
        notes: formData.notes || null
      };
      
      await fine.table("cardio_logs").insert(newCardioLog);
      
      toast({
        title: "Success",
        description: "Cardio session logged successfully"
      });
      
      // Reset form
      setFormData({
        type: "running",
        duration: "",
        distance: "",
        caloriesBurned: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error adding cardio log:", error);
      toast({
        title: "Error",
        description: "Failed to log cardio session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Cardio Tracking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10">
              <CardTitle className="text-xl flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-red-500"
                >
                  <path d="M19 8v3m0 0v3m0-3h3m-3 0h-3" />
                  <path d="M2 8h6l2-2h4l2 2h6" />
                  <path d="M3.2 14.65a9 9 0 0 0 17.6 0" />
                </svg>
                <span>Log Cardio Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Cardio Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cardio type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="elliptical">Elliptical</SelectItem>
                      <SelectItem value="rowing">Rowing</SelectItem>
                      <SelectItem value="stair_climber">Stair Climber</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-1.5">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      Duration (min)
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.duration}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="distance" className="flex items-center gap-1.5">
                      <Route className="h-4 w-4 text-muted-foreground" />
                      Distance (km)
                    </Label>
                    <Input
                      id="distance"
                      name="distance"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.2"
                      value={formData.distance}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caloriesBurned" className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-muted-foreground" />
                      Calories Burned
                    </Label>
                    <Input
                      id="caloriesBurned"
                      name="caloriesBurned"
                      type="number"
                      placeholder="e.g., 250"
                      value={formData.caloriesBurned}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="How was your cardio session?"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Log Cardio Session"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Cardio Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                No recent cardio sessions. Start logging your cardio workouts!
              </p>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Cardio Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Cardio progress chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default function ProtectedCardioPage() {
  return <ProtectedRoute Component={CardioPage} />;
}