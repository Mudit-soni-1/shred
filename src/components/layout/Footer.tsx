import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
          </div>
          
          <div className="flex items-center space-x-1 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-current text-red-500" />
            <span>for your fitness journey</span>
          </div>
        </div>
      </div>
    </footer>
  );
}