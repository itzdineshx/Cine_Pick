import { Filter, Home, Info, Heart, Swords, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface HeaderProps {
  onShowFilters: () => void;
  onScrollToSection: (section: string) => void;
  onShowFavorites: () => void;
  favoritesCount: number;
  onShowWatchlist?: () => void;
  watchlistCount?: number;
}

const Header = ({ 
  onShowFilters, 
  onScrollToSection, 
  onShowFavorites, 
  favoritesCount,
  onShowWatchlist,
  watchlistCount = 0 
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <img 
                src="/lovable-uploads/cf0d270f-9aec-4651-833c-f5afd0c0e03e.png" 
                alt="CinePick Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
            </div>
            <span className="font-cinema text-xl sm:text-2xl text-primary tracking-wider">
              CinePick
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onScrollToSection('hero')}
              className="text-foreground hover:text-primary transition-colors hidden sm:flex"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Home</span>
            </Button>

            <Link to="/search">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowFilters}
              className="text-foreground hover:text-primary transition-colors hidden sm:flex"
            >
              <Filter className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>

            <Link to="/battle">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-primary transition-colors"
              >
                <Swords className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Battle</span>
              </Button>
            </Link>

            {onShowWatchlist && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowWatchlist}
                className="text-foreground hover:text-primary transition-colors relative hidden sm:flex"
              >
                <Clock className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Watchlist</span>
                {watchlistCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center text-xs">
                    {watchlistCount}
                  </Badge>
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowFavorites}
              className="text-foreground hover:text-primary transition-colors relative"
            >
              <Heart className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center text-xs">
                  {favoritesCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onScrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors hidden sm:flex"
            >
              <Info className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">About</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;