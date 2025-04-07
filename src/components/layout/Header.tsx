import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Home, 
  LogOut, 
  PieChart, 
  User, 
  Menu,
  X,
  Moon,
  Heart,
  Bell
} from "lucide-react";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { data: session } = fine.auth.useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fine.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Dumbbell, label: "Workouts", path: "/workouts" },
    { icon: PieChart, label: "Food Log", path: "/food" },
    { icon: Moon, label: "Sleep & Mood", path: "/sleep-mood" },
    { icon: Heart, label: "Cardio", path: "/cardio" },
    { icon: Bell, label: "Reminders", path: "/reminders" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          <span>FitTrack</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path} 
              className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm">
                Hi, {session.user.name || session.user.email?.split('@')[0]}
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
          
          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-background">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    FitTrack
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                
                {session && (
                  <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{session.user.name || session.user.email?.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}