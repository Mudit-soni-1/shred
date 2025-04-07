import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import { fine } from "@/lib/fine";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, isPending } = fine.auth.useSession();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        const profiles = await fine.table("user_profiles")
          .select()
          .eq("userId", session.user.id);
        
        setHasProfile(profiles.length > 0 && profiles[0].onboardingCompleted);
      } catch (error) {
        console.error("Error checking user profile:", error);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user) {
      checkUserProfile();
    } else if (!isPending) {
      setIsLoading(false);
    }
  }, [session, isPending]);
  
  if (isPending || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  if (hasProfile) {
    return <Navigate to="/" />;
  }
  
  return <OnboardingFlow />;
}