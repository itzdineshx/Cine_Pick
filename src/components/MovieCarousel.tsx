import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Plus, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/services/types';
import { Link } from 'react-router-dom';

interface MovieCarouselProps {
  title: string;
  fetchMovies: () => Promise<{ results: Movie[] }>;
  onAddToWatchlist?: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
  isInWatchlist?: (id: number) => boolean;
  isFavorite?: (id: number) => boolean;
}

const MovieCarousel = ({ 
  title, 
  fetchMovies, 
  onAddToWatchlist, 
  onToggleFavorite,
  isInWatchlist,
  isFavorite 
}: MovieCarouselProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMovies();
        setMovies(data.results || []);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [fetchMovies]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef) return;
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    containerRef.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const handleScroll = () => {
    if (containerRef) {
      setScrollPosition(containerRef.scrollLeft);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="font-cinema text-2xl text-primary mb-4">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-40 h-60 bg-secondary rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="mb-8 group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-cinema text-2xl text-primary">{title}</h2>
        <Link 
          to={`/search?category=${encodeURIComponent(title.toLowerCase().replace(' ', '-'))}`}
          className="text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          View All →
        </Link>
      </div>
      
      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          onClick={() => scroll('left')}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Movie List */}
        <div 
          ref={setContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-shrink-0 w-40 group/card relative"
            >
              <div className="relative overflow-hidden rounded-lg card-cinema">
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : '/placeholder.svg'
                  }
                  alt={movie.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover/card:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <div className="flex gap-2 mb-2">
                    {onAddToWatchlist && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWatchlist(movie);
                        }}
                      >
                        {isInWatchlist?.(movie.id) ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    {onToggleFavorite && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(movie);
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${isFavorite?.(movie.id) ? 'fill-accent text-accent' : ''}`} 
                        />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-xs font-semibold">{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              
              <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2">
                {movie.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default MovieCarousel;
