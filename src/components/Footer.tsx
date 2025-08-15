import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <img 
            src="/lovable-uploads/cf0d270f-9aec-4651-833c-f5afd0c0e03e.png" 
            alt="CinePick Logo" 
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
          <span className="font-cinema text-lg sm:text-xl text-primary">CinePick</span>
        </div>
        
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2025 CinePick. All rights reserved.</p>
          <p>Your next favorite film is just a click away.</p>
          <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary" /> for Movie lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;