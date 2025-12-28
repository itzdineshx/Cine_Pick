import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, History, TrendingUp, Filter, Star, Plus, Check, Heart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoritesModal from '@/components/FavoritesModal';
import WatchlistModal from '@/components/WatchlistModal';
import MovieDetailModal from '@/components/MovieDetailModal';
import { searchMovies, fetchGenres, discoverMoviesWithPagination, getTrailerUrl, type Movie, type Genre } from '@/services/tmdb';
import useSearchHistory from '@/hooks/useSearchHistory';
import useFavorites from '@/hooks/useFavorites';
import useWatchlist from '@/hooks/useWatchlist';
import { useToast } from '@/hooks/use-toast';

const TRENDING_SEARCHES = [
  'Marvel', 'Christopher Nolan', 'Horror 2024', 'Oscar Winners', 'Sci-Fi Classics'
];

const currentYear = new Date().getFullYear();

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Filters
const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');

  // Modals
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Hooks
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { favorites, isFavorite, toggleFavorite, removeFromFavorites } = useFavorites();
  const { watchlist, isInWatchlist, toggleWatchlist, removeFromWatchlist } = useWatchlist();

  // Load genres
  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  // Search function
  const performSearch = useCallback(async (searchQuery: string, pageNum: number = 1, append: boolean = false) => {
    if (!searchQuery.trim() && !selectedGenre && !selectedYear) return;
    
    setIsLoading(true);
    try {
      let data;
      
      if (searchQuery.trim()) {
        data = await searchMovies(searchQuery, pageNum);
        if (pageNum === 1) addToHistory(searchQuery);
      } else {
        data = await discoverMoviesWithPagination({
          genres: selectedGenre && selectedGenre !== 'all' ? [parseInt(selectedGenre)] : [],
          yearRange: selectedYear && selectedYear !== 'all' ? [parseInt(selectedYear), parseInt(selectedYear)] : [1900, currentYear],
          minRating: minRating,
          sortBy: sortBy,
          page: pageNum,
        });
      }

      const newMovies = data.results || [];
      setMovies(append ? [...movies, ...newMovies] : newMovies);
      setTotalResults(data.total_results || 0);
      setHasMore(pageNum < (data.total_pages || 0));
      setPage(pageNum);
    } catch (error) {
      toast({
        title: 'Search Error',
        description: 'Failed to search movies. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre, selectedYear, minRating, sortBy, movies, addToHistory, toast]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    performSearch(query, 1);
  };

  // Handle quick search from history or trending
  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setSearchParams({ q: searchTerm });
    performSearch(searchTerm, 1);
  };

  // Load more results
  const loadMore = () => {
    performSearch(query, page + 1, true);
  };

  // Apply filters
  const applyFilters = () => {
    performSearch(query, 1);
  };

  // Toggle favorite/watchlist for movie
  const handleToggleFavorite = (movie: Movie) => {
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview || '',
    });
  };

  const handleToggleWatchlist = (movie: Movie) => {
    toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview || '',
    });
  };

  // Generate year options
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onShowFilters={() => setShowFilters(!showFilters)}
        onScrollToSection={() => {}}
        onShowFavorites={() => setShowFavorites(true)}
        favoritesCount={favorites.length}
      />

      <main className="pt-20 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="font-cinema text-4xl sm:text-5xl text-primary mb-2">
              Search Movies
            </h1>
            <p className="text-muted-foreground">
              Find your next favorite film
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 py-6 text-lg bg-secondary border-border rounded-full"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setQuery('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              variant={showFilters ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowWatchlist(true)}
            >
              Watchlist ({watchlist.length})
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mb-8 p-6 bg-secondary/50 rounded-xl border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.filter(genre => genre.id != null && genre.id !== 0).map((genre) => (
                        <SelectItem key={genre.id} value={String(genre.id)}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover max-h-60">
                      <SelectItem value="all">All Years</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Min Rating: {minRating}
                  </label>
                  <Slider
                    value={[minRating]}
                    onValueChange={([val]) => setMinRating(val)}
                    max={10}
                    step={0.5}
                    className="mt-4"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="popularity.desc">Popularity</SelectItem>
                      <SelectItem value="vote_average.desc">Rating</SelectItem>
                      <SelectItem value="release_date.desc">Release Date</SelectItem>
                      <SelectItem value="revenue.desc">Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full mt-4">
                Apply Filters
              </Button>
            </div>
          )}

          {/* Search History & Trending */}
          {!movies.length && !isLoading && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <History className="w-4 h-4" />
                      <span className="text-sm font-medium">Recent Searches</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors group"
                        onClick={() => handleQuickSearch(term)}
                      >
                        {term}
                        <X 
                          className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(term);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      onClick={() => handleQuickSearch(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !movies.length && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Results */}
          {movies.length > 0 && (
            <>
              <div className="mb-4 text-muted-foreground text-sm">
                Found {totalResults.toLocaleString()} results
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="group relative cursor-pointer"
                    onClick={() => setSelectedMovieId(movie.id)}
                  >
                    <div className="relative overflow-hidden rounded-lg card-cinema">
                      <img
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : '/placeholder.svg'
                        }
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <div className="flex gap-2 mb-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-8 h-8"
                            onClick={() => handleToggleWatchlist(movie)}
                          >
                            {isInWatchlist(movie.id) ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-8 h-8"
                            onClick={() => handleToggleFavorite(movie)}
                          >
                            <Heart 
                              className={`w-4 h-4 ${isFavorite(movie.id) ? 'fill-accent text-accent' : ''}`} 
                            />
                          </Button>
                        </div>
                        
                        <a
                          href={getTrailerUrl(movie.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Watch Trailer →
                        </a>
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

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={loadMore} 
                    disabled={isLoading}
                    variant="secondary"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onRemoveFavorite={removeFromFavorites}
        onWatchTrailer={getTrailerUrl}
      />

      <WatchlistModal
        isOpen={showWatchlist}
        onClose={() => setShowWatchlist(false)}
        watchlist={watchlist}
        onRemove={removeFromWatchlist}
        onWatchTrailer={getTrailerUrl}
      />

      <MovieDetailModal
        movieId={selectedMovieId}
        isOpen={selectedMovieId !== null}
        onClose={() => setSelectedMovieId(null)}
        onAddToWatchlist={handleToggleWatchlist}
        onToggleFavorite={handleToggleFavorite}
        isInWatchlist={isInWatchlist}
        isFavorite={isFavorite}
        onMovieClick={(movieId) => setSelectedMovieId(movieId)}
      />
    </div>
  );
};

export default Search;
