import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2, Bell, Clock, Plus, Trash2 } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import type { Reminder } from "@/lib/db-types";

const RemindersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "workout",
    title: "",
    message: "",
    time: "08:00",
    days: ["1", "3", "5"], // Monday, Wednesday, Friday
    enabled: true
  });
  
  const { toast } = useToast();
  const { data: session, isPending } = fine.auth.useSession();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const currentDays = [...prev.days];
      if (currentDays.includes(day)) {
        return { ...prev, days: currentDays.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...currentDays, day] };
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add reminders",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.title || !formData.time || formData.days.length === 0) {
      toast({
        title: "Error",
        description: "Title, time, and at least one day are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newReminder: Reminder = {
        userId: session.user.id,
        type: formData.type,
        title: formData.title,
        message: formData.message || null,
        time: formData.time,
        days: JSON.stringify(formData.days),
        enabled: formData.enabled
      };
      
      await fine.table("reminders").insert(newReminder);
      
      toast({
        title: "Success",
        description: "Reminder created successfully"
      });
      
      // Reset form
      setFormData({
        type: "workout",
        title: "",
        message: "",
        time: "08:00",
        days: ["1", "3", "5"],
        enabled: true
      });
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast({
        title: "Error",
        description: "Failed to create reminder. Please try again.",
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

  const dayLabels = [
    { value: "0", label: "Sun" },
    { value: "1", label: "Mon" },
    { value: "2", label: "Tue" },
    { value: "3", label: "Wed" },
    { value: "4", label: "Thu" },
    { value: "5", label: "Fri" },
    { value: "6", label: "Sat" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Reminders</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                <span>Create Reminder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Reminder Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workout">Workout</SelectItem>
                      <SelectItem value="meal">Meal</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="sleep">Sleep</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Time for your workout!"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input
                    id="message"
                    name="message"
                    placeholder="e.g., Don't forget your leg day!"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>Enabled</span>
                      <Switch
                        checked={formData.enabled}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                      />
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Repeat on days</Label>
                  <div className="flex flex-wrap gap-2">
                    {dayLabels.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={formData.days.includes(day.value)}
                          onCheckedChange={() => handleDayToggle(day.value)}
                        />
                        <Label htmlFor={`day-${day.value}`} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Reminder
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                No reminders set. Create your first reminder to get started!
              </p>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Workout Reminder</p>
                      <p className="text-sm text-muted-foreground">Every Mon, Wed, Fri at 8:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
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
                        className="text-blue-600"
                      >
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Supplement Reminder</p>
                      <p className="text-sm text-muted-foreground">Daily at 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default function ProtectedRemindersPage() {
  return <ProtectedRoute Component={RemindersPage} />;
}