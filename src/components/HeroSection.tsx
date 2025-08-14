import { Film, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onPickMovie: () => void;
  onShowFilters: () => void;
  isLoading: boolean;
}

const HeroSection = ({ onPickMovie, onShowFilters, isLoading }: HeroSectionProps) => {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden projector-beam px-4 sm:px-6"
    >
      <div className="container mx-auto text-center z-10">
        <div className="animate-fade-in-up space-y-6 sm:space-y-8">
          {/* Logo Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Film className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-primary animate-pulse-golden" />
              <div className="absolute inset-0 animate-spin opacity-30">
                <Film className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-primary" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="font-cinema text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-primary leading-none">
            CinePick
          </h1>
          
          {/* Tagline */}
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light px-4">
            Your next favorite film is just a click away
          </p>

          {/* Action Button */}
          <div className="flex justify-center items-center pt-4">
            <Button
              onClick={onPickMovie}
              disabled={isLoading}
              size="lg"
              className="golden-glow bg-primary text-primary-foreground hover:bg-primary/90 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold transition-all duration-300 w-full max-w-xs sm:w-auto"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              {isLoading ? 'Finding Your Movie...' : '🎬 Pick a Movie!'}
            </Button>
          </div>

          {/* Subtitle */}
          <div className="pt-8 text-xs sm:text-sm text-muted-foreground">
            <p className="film-strip">
              Powered by The Movie Database • No repeats in your session
            </p>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 sm:w-2 h-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-30"></div>
      </div>
    </section>
  );
};

export default HeroSection;