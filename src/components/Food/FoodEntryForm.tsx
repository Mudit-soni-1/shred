import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { Loader2, Plus, Search } from "lucide-react";
import type { FoodEntry } from "@/lib/db-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FoodEntryFormProps {
  onFoodAdded: () => void;
}

// Common food items with pre-filled nutritional values
const quickAddFoods = [
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice (100g)", calories: 112, protein: 2.6, carbs: 24, fat: 0.8 },
  { name: "Egg", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: "Whey Protein (1 scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Oatmeal (100g)", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  { name: "Greek Yogurt (100g)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  { name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "Avocado (100g)", calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { name: "Sweet Potato (100g)", calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 }
];

export function FoodEntryForm({ onFoodAdded }: FoodEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("manual");
  
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add food entries",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || !formData.calories) {
      toast({
        title: "Error",
        description: "Food name and calories are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const newFoodEntry: FoodEntry = {
        userId: session.user.id,
        name: formData.name,
        calories: parseInt(formData.calories),
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fat: formData.fat ? parseFloat(formData.fat) : null,
        date: today
      };
      
      await fine.table("food_entries").insert(newFoodEntry);
      
      toast({
        title: "Success",
        description: "Food entry added successfully"
      });
      
      // Reset form
      setFormData({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: ""
      });
      
      // Notify parent component
      onFoodAdded();
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickAdd = async (food: typeof quickAddFoods[0]) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add food entries",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const newFoodEntry: FoodEntry = {
        userId: session.user.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        date: today
      };
      
      await fine.table("food_entries").insert(newFoodEntry);
      
      toast({
        title: "Success",
        description: `${food.name} added successfully`
      });
      
      // Notify parent component
      onFoodAdded();
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredFoods = quickAddFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <CardTitle className="text-xl">Add Food</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="quick">Quick Add</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Food Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Chicken Breast"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    name="calories"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.calories}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    name="protein"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25"
                    value={formData.protein}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    name="carbs"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10"
                    value={formData.carbs}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    name="fat"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5"
                    value={formData.fat}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Food
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="quick">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search foods..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-2 px-3"
                      onClick={() => handleQuickAdd(food)}
                      disabled={isLoading}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="font-medium">{food.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </span>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No foods found matching your search
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}