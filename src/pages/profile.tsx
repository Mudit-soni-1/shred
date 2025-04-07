import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2, User, Settings, Shield, Bell } from "lucide-react";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  const { data: session, isPending } = fine.auth.useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fine.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
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
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card className="border-2 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary/60" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl font-medium">
                        {session?.user.name || session?.user.email?.split('@')[0]}
                      </h3>
                      <p className="text-muted-foreground">{session?.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {session?.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Account Type</p>
                      <p className="font-medium">Standard</p>
                    </div>
                  </div>
                  
                  <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card className="border-2 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="units">Use Metric Units</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between metric (kg) and imperial (lbs) units
                        </p>
                      </div>
                      <Switch id="units" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="theme">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode for the application
                        </p>
                      </div>
                      <Switch id="theme" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="privacy">Private Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Hide your profile and progress from other users
                        </p>
                      </div>
                      <Switch id="privacy" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="border-2 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="workout-reminders">Workout Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders for scheduled workouts
                        </p>
                      </div>
                      <Switch id="workout-reminders" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="meal-reminders">Meal Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notifications for meal and supplement times
                        </p>
                      </div>
                      <Switch id="meal-reminders" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="progress-updates">Progress Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly summaries of your fitness progress
                        </p>
                      </div>
                      <Switch id="progress-updates" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="motivation">Motivational Quotes</Label>
                        <p className="text-sm text-muted-foreground">
                          Daily motivational quotes and tips
                        </p>
                      </div>
                      <Switch id="motivation" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default function ProtectedProfilePage() {
  return <ProtectedRoute Component={ProfilePage} />;
}