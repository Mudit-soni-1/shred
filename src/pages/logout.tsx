import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const logout = async () => {
      try {
        await fine.auth.signOut();
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    logout();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <Navigate to="/" />;
}