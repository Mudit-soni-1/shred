import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SleepCard } from "@/components/Dashboard/SleepCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2, Moon, Heart, Smile } from "lucide-react";
import { fine } from "@/lib/fine";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SleepMoodPage = () => {
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState("");
  const { isPending } = fine.auth.useSession();

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
        <h1 className="text-3xl font-bold mb-6">Sleep & Mood Tracking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SleepCard />
          
          <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Smile className="h-5 w-5 text-purple-500" />
                <span>Mood & Energy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
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
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="notes">Journal Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="How are you feeling today? Any specific thoughts or emotions to note?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button className="w-full">Save Today's Entry</Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                Sleep History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sleep history chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default function ProtectedSleepMoodPage() {
  return <ProtectedRoute Component={SleepMoodPage} />;
}