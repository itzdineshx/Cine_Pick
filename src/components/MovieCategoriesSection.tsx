import { useCallback } from 'react';
import MovieCarousel from './MovieCarousel';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getNowPlayingMovies, 
  getUpcomingMovies 
} from '@/services/tmdb';
import { Movie } from '@/services/types';

interface MovieCategoriesSectionProps {
  onAddToWatchlist: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  isFavorite: (id: number) => boolean;
}

const MovieCategoriesSection = ({
  onAddToWatchlist,
  onToggleFavorite,
  isInWatchlist,
  isFavorite,
}: MovieCategoriesSectionProps) => {
  // Memoize fetch functions to prevent unnecessary re-renders
  const fetchTrending = useCallback(() => getPopularMovies(1), []);
  const fetchNowPlaying = useCallback(() => getNowPlayingMovies(1), []);
  const fetchTopRated = useCallback(() => getTopRatedMovies(1), []);
  const fetchUpcoming = useCallback(() => getUpcomingMovies(1), []);

  return (
    <section id="categories" className="py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-cinema text-3xl sm:text-4xl text-primary mb-2">
            Browse Movies
          </h2>
          <p className="text-muted-foreground">
            Discover what's trending, now playing, and coming soon
          </p>
        </div>

        <MovieCarousel
          title="Trending Now"
          fetchMovies={fetchTrending}
          onAddToWatchlist={onAddToWatchlist}
          onToggleFavorite={onToggleFavorite}
          isInWatchlist={isInWatchlist}
          isFavorite={isFavorite}
        />

        <MovieCarousel
          title="Now Playing"
          fetchMovies={fetchNowPlaying}
          onAddToWatchlist={onAddToWatchlist}
          onToggleFavorite={onToggleFavorite}
          isInWatchlist={isInWatchlist}
          isFavorite={isFavorite}
        />

        <MovieCarousel
          title="Top Rated"
          fetchMovies={fetchTopRated}
          onAddToWatchlist={onAddToWatchlist}
          onToggleFavorite={onToggleFavorite}
          isInWatchlist={isInWatchlist}
          isFavorite={isFavorite}
        />

        <MovieCarousel
          title="Coming Soon"
          fetchMovies={fetchUpcoming}
          onAddToWatchlist={onAddToWatchlist}
          onToggleFavorite={onToggleFavorite}
          isInWatchlist={isInWatchlist}
          isFavorite={isFavorite}
        />
      </div>
    </section>
  );
};

export default MovieCategoriesSection;
