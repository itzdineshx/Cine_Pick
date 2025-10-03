import { useState, useEffect } from "react";
import { Search, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import OptimizedImage from "@/components/OptimizedImage";
import { discoverMovies, type Movie } from "@/services/tmdb";

interface BattleMovieSelectorProps {
  movieNumber: 1 | 2;
  selectedMovie: Movie | null;
  onMovieSelect: (movieNumber: 1 | 2, movie: Movie) => void;
}

const BattleMovieSelector = ({ movieNumber, selectedMovie, onMovieSelect }: BattleMovieSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setIsLoading(true);
    try {
      const results = await discoverMovies({
        genres: [],
        yearRange: [2000, 2025],
        minRating: 7,
        language: "en",
        runtime: [60, 300],
        sortBy: "popularity.desc",
        page: 1
      });
      setMovies(results.slice(0, 20));
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPopularMovies();
      return;
    }

    setIsLoading(true);
    try {
      const results = await discoverMovies({
        genres: [],
        yearRange: [1980, 2025],
        minRating: 0,
        language: "en",
        sortBy: "popularity.desc",
      });
      
      const filtered = results.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setMovies(filtered.slice(0, 20));
    } catch (error) {
      console.error('Failed to search movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-cinema rounded-xl p-6">
      <div className="mb-6">
        <h2 className="font-cinema text-2xl sm:text-3xl text-cinema-gold mb-4">
          Select Movie {movieNumber}
        </h2>
        
        {selectedMovie ? (
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cinema-dark to-background">
              {selectedMovie.poster_path ? (
                <OptimizedImage
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">
                  <Film className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-cinema text-xl text-foreground">{selectedMovie.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'Unknown'}
              </p>
              <Button
                onClick={() => onMovieSelect(movieNumber, selectedMovie)}
                variant="outline"
                className="mt-4 w-full border-cinema-gold text-cinema-gold hover:bg-cinema-gold/10"
              >
                Change Selection
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                className="bg-cinema-gold text-background hover:bg-cinema-gold/90"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="h-[400px] sm:h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-cinema-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => onMovieSelect(movieNumber, movie)}
                      className="group relative overflow-hidden rounded-lg bg-secondary hover:ring-2 hover:ring-cinema-gold transition-all duration-300"
                    >
                      {movie.poster_path ? (
                        <OptimizedImage
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">
                          <Film className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-semibold line-clamp-2">
                          {movie.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

export default BattleMovieSelector;
