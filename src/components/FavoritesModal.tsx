import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Star, X } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { FavoriteMovie } from "@/hooks/useFavorites";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteMovie[];
  onRemoveFavorite: (movieId: number) => void;
  onWatchTrailer: (movieTitle: string) => void;
}

const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  favorites, 
  onRemoveFavorite,
  onWatchTrailer 
}: FavoritesModalProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 text-primary fill-current" />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-muted-foreground" />);
      }
    }
    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-cinema text-primary">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            My Favorites ({favorites.length})
          </DialogTitle>
        </DialogHeader>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No favorite movies yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click the heart icon on movies to add them to your favorites
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg bg-card">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  {movie.poster_path ? (
                    <OptimizedImage
                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="w-20 h-30 sm:w-24 sm:h-36 object-cover rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-30 sm:w-24 sm:h-36 bg-secondary rounded-md flex items-center justify-center">
                      <span className="text-xs text-muted-foreground text-center">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                    <h3 className="font-semibold text-base sm:text-lg leading-tight">{movie.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFavorite(movie.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(movie.vote_average)}
                      <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                    {movie.overview}
                  </p>
                  
                  <Button
                    onClick={() => onWatchTrailer(movie.title)}
                    size="sm"
                    className="w-fit"
                  >
                    Watch Trailer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;