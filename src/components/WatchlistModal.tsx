import { X, Star, Trash2, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WatchlistMovie } from '@/hooks/useWatchlist';
import { formatDistanceToNow } from 'date-fns';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistMovie[];
  onRemove: (movieId: number) => void;
  onWatchTrailer: (title: string) => string;
}

const WatchlistModal = ({ 
  isOpen, 
  onClose, 
  watchlist, 
  onRemove, 
  onWatchTrailer 
}: WatchlistModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-cinema text-2xl text-primary flex items-center gap-2">
            <Clock className="w-6 h-6" />
            My Watchlist
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Your watchlist is empty</p>
              <p className="text-sm">Add movies you want to watch later!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((movie) => (
                <div 
                  key={movie.id}
                  className="flex gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <img
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : '/placeholder.svg'
                    }
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-sm text-muted-foreground">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      Added {formatDistanceToNow(new Date(movie.addedAt), { addSuffix: true })}
                    </p>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {movie.overview}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => window.open(onWatchTrailer(movie.title), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      onClick={() => onRemove(movie.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WatchlistModal;
