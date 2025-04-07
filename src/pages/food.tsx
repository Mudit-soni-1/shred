import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FoodEntryForm } from "@/components/Food/FoodEntryForm";
import { FoodList } from "@/components/Food/FoodList";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Loader2 } from "lucide-react";
import { fine } from "@/lib/fine";

const FoodPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isPending } = fine.auth.useSession();

  const handleFoodAdded = () => {
    setRefreshTrigger(prev => prev + 1);
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
        <h1 className="text-3xl font-bold mb-6">Food Tracking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FoodEntryForm onFoodAdded={handleFoodAdded} />
          <FoodList refreshTrigger={refreshTrigger} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default function ProtectedFoodPage() {
  return <ProtectedRoute Component={FoodPage} />;
}