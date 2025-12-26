import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import useFavorites from "@/hooks/useFavorites";
import useWatchlist from "@/hooks/useWatchlist";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MovieCard from "@/components/MovieCard";
import FilterPanel from "@/components/FilterPanel";
import FavoritesModal from "@/components/FavoritesModal";
import WatchlistModal from "@/components/WatchlistModal";
import MovieCategoriesSection from "@/components/MovieCategoriesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { 
  fetchGenres, 
  getRandomMovie, 
  getTrailerUrl, 
  type Genre, 
  type Movie, 
  type Filters 
} from "@/services/tmdb";

const Index = () => {
  const { toast } = useToast();
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    genres: [],
    yearRange: [1980, 2025],
    minRating: 0,
    language: "en",
    runtime: [60, 300],
    certification: "",
    sortBy: "popularity.desc"
  });
  const [shownMovieIds, setShownMovieIds] = useLocalStorage<number[]>('cinepick-shown-movies', []);
  const [userPreferences, setUserPreferences] = useLocalStorage('cinepick-preferences', currentFilters);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const { favorites, isFavorite, toggleFavorite, removeFromFavorites } = useFavorites();
  const { watchlist, isInWatchlist, toggleWatchlist, removeFromWatchlist } = useWatchlist();

  // Load genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      setIsLoadingGenres(true);
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load movie genres. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingGenres(false);
      }
    };

    loadGenres();
  }, [toast]);

  // Load user preferences on mount
  useEffect(() => {
    if (userPreferences) {
      setCurrentFilters(userPreferences);
    }
  }, [userPreferences]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  const handlePickMovie = async (filters?: Filters) => {
    setIsLoading(true);
    try {
      const movie = await getRandomMovie(filters || currentFilters, shownMovieIds);
      
      if (!movie) {
        toast({
          title: "🎞 No more movies found",
          description: "No more movies match your current filters. Try adjusting your criteria or clearing filters.",
          variant: "destructive",
        });
        return;
      }

      setCurrentMovie(movie);
      setShownMovieIds([...shownMovieIds, movie.id]);
      
      // Scroll to movie card
      setTimeout(() => {
        const movieSection = document.getElementById('movie-display');
        if (movieSection) {
          movieSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch movie recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = (filters: Filters) => {
    setCurrentFilters(filters);
    setUserPreferences(filters); // Save to localStorage
    handlePickMovie(filters);
  };

  const handleWatchTrailer = (movieTitle: string) => {
    const trailerUrl = getTrailerUrl(movieTitle);
    return trailerUrl;
  };

  const handleToggleFavorite = (movie: Movie) => {
    const favoriteMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview || '',
    };
    toggleFavorite(favoriteMovie);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    const watchlistMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview || '',
    };
    toggleWatchlist(watchlistMovie);
    
    if (!isInWatchlist(movie.id)) {
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onShowFilters={() => setShowFilters(true)}
        onScrollToSection={handleScrollToSection}
        onShowFavorites={() => setShowFavorites(true)}
        favoritesCount={favorites.length}
        onShowWatchlist={() => setShowWatchlist(true)}
        watchlistCount={watchlist.length}
      />
      
      <main>
        <HeroSection 
          onPickMovie={() => handlePickMovie()}
          onShowFilters={() => setShowFilters(true)}
          isLoading={isLoading}
        />
        
        {currentMovie && (
          <section id="movie-display" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
            <div className="container mx-auto">
              <MovieCard
                movie={currentMovie}
                onPickAnother={() => handlePickMovie()}
                onWatchTrailer={handleWatchTrailer}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(currentMovie.id)}
              />
            </div>
          </section>
        )}

        {/* Movie Categories Section */}
        <MovieCategoriesSection
          onAddToWatchlist={handleAddToWatchlist}
          onToggleFavorite={handleToggleFavorite}
          isInWatchlist={isInWatchlist}
          isFavorite={isFavorite}
        />
        
        <AboutSection />
      </main>
      
      <Footer />
      
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        genres={genres}
        isLoadingGenres={isLoadingGenres}
      />
      
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onRemoveFavorite={removeFromFavorites}
        onWatchTrailer={handleWatchTrailer}
      />

      <WatchlistModal
        isOpen={showWatchlist}
        onClose={() => setShowWatchlist(false)}
        watchlist={watchlist}
        onRemove={removeFromWatchlist}
        onWatchTrailer={handleWatchTrailer}
      />
    </div>
  );
};

export default Index;
