import { useState, useEffect } from 'react';
import { X, Star, Clock, Calendar, Play, Heart, Plus, Check, Users, MessageSquare, Film, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import OptimizedImage from '@/components/OptimizedImage';
import { getMovieFullDetails, type MovieFullDetails, type Movie, type Cast, type Review, type Video } from '@/services/tmdb';

interface MovieDetailModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist?: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
  isInWatchlist?: (id: number) => boolean;
  isFavorite?: (id: number) => boolean;
  onMovieClick?: (movieId: number) => void;
}

const MovieDetailModal = ({
  movieId,
  isOpen,
  onClose,
  onAddToWatchlist,
  onToggleFavorite,
  isInWatchlist,
  isFavorite,
  onMovieClick,
}: MovieDetailModalProps) => {
  const [movie, setMovie] = useState<MovieFullDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<Video | null>(null);
  const [castScrollPosition, setCastScrollPosition] = useState(0);

  useEffect(() => {
    if (isOpen && movieId) {
      setIsLoading(true);
      getMovieFullDetails(movieId)
        .then((data) => {
          setMovie(data);
          // Auto-select first trailer
          const trailer = data?.videos?.find(
            (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          setActiveTrailer(trailer || null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setMovie(null);
      setActiveTrailer(null);
    }
  }, [isOpen, movieId]);

  if (!isOpen) return null;

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const scrollCast = (direction: 'left' | 'right') => {
    const container = document.getElementById('cast-scroll-container');
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? castScrollPosition - scrollAmount 
        : castScrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setCastScrollPosition(newPosition);
    }
  };

  const director = movie?.credits?.crew?.find((c) => c.job === 'Director');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-background rounded-xl overflow-hidden border border-border shadow-2xl">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <X className="w-5 h-5" />
        </Button>

        <ScrollArea className="h-[95vh]">
          {isLoading ? (
            <div className="p-6 space-y-6">
              <Skeleton className="w-full h-64 rounded-xl" />
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-full h-32" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-lg" />
                ))}
              </div>
            </div>
          ) : movie ? (
            <div>
              {/* Hero Section with Backdrop */}
              <div className="relative h-64 sm:h-80 md:h-96">
                {movie.backdrop_path ? (
                  <OptimizedImage
                    src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                
                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex gap-4 sm:gap-6">
                  {/* Poster */}
                  <div className="flex-shrink-0 w-24 sm:w-32 md:w-40 -mb-16 sm:-mb-20 relative z-10">
                    {movie.poster_path ? (
                      <OptimizedImage
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg shadow-2xl border-2 border-border"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-secondary rounded-lg flex items-center justify-center">
                        <Film className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Title & Quick Info */}
                  <div className="flex-1 min-w-0 pb-2">
                    <h1 className="font-cinema text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground line-clamp-2">
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className="text-muted-foreground italic mt-1 text-sm sm:text-base line-clamp-1">
                        "{movie.tagline}"
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <span className="font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 pt-20 sm:pt-24 space-y-6">
                {/* Action Buttons & Genres */}
                <div className="flex flex-wrap items-center gap-3">
                  {activeTrailer && (
                    <Button
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${activeTrailer.key}`, '_blank')}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Trailer
                    </Button>
                  )}
                  
                  {onToggleFavorite && (
                    <Button
                      onClick={() => onToggleFavorite(movie)}
                      variant={isFavorite?.(movie.id) ? "default" : "outline"}
                      className={isFavorite?.(movie.id) ? "bg-destructive hover:bg-destructive/90" : ""}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite?.(movie.id) ? "fill-current" : ""}`} />
                      {isFavorite?.(movie.id) ? "Favorited" : "Favorite"}
                    </Button>
                  )}
                  
                  {onAddToWatchlist && (
                    <Button
                      onClick={() => onAddToWatchlist(movie)}
                      variant="outline"
                    >
                      {isInWatchlist?.(movie.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          In Watchlist
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Watchlist
                        </>
                      )}
                    </Button>
                  )}

                  {movie.imdb_id && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(`https://www.imdb.com/title/${movie.imdb_id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      IMDb
                    </Button>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <Badge key={genre.id} variant="secondary" className="bg-secondary/80">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Overview */}
                <div>
                  <h2 className="text-lg font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview || 'No overview available.'}
                  </p>
                </div>

                {/* Director & Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {director && (
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Director</p>
                      <p className="font-medium mt-1">{director.name}</p>
                    </div>
                  )}
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                    <p className="font-medium mt-1">{movie.status}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
                    <p className="font-medium mt-1">{formatCurrency(movie.budget)}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenue</p>
                    <p className="font-medium mt-1">{formatCurrency(movie.revenue)}</p>
                  </div>
                </div>

                {/* Tabs for Cast, Videos, Reviews, Similar */}
                <Tabs defaultValue="cast" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="cast" className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Cast</span>
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      <span className="hidden sm:inline">Videos</span>
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Reviews</span>
                    </TabsTrigger>
                    <TabsTrigger value="similar" className="flex items-center gap-1">
                      <Film className="w-4 h-4" />
                      <span className="hidden sm:inline">Similar</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Cast Tab */}
                  <TabsContent value="cast">
                    {movie.credits?.cast?.length > 0 ? (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => scrollCast('left')}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div 
                          id="cast-scroll-container"
                          className="flex gap-4 overflow-x-auto scrollbar-hide px-8 pb-2"
                        >
                          {movie.credits.cast.slice(0, 20).map((person) => (
                            <CastCard key={person.id} person={person} />
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => scrollCast('right')}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No cast information available.</p>
                    )}
                  </TabsContent>

                  {/* Videos Tab */}
                  <TabsContent value="videos">
                    {movie.videos?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {movie.videos.filter(v => v.site === 'YouTube').slice(0, 6).map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No videos available.</p>
                    )}
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews">
                    {movie.reviews?.length > 0 ? (
                      <div className="space-y-4">
                        {movie.reviews.slice(0, 5).map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No reviews available.</p>
                    )}
                  </TabsContent>

                  {/* Similar Movies Tab */}
                  <TabsContent value="similar">
                    {movie.similar?.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {movie.similar.slice(0, 12).map((similarMovie) => (
                          <SimilarMovieCard 
                            key={similarMovie.id} 
                            movie={similarMovie} 
                            onClick={() => onMovieClick?.(similarMovie.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No similar movies found.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              Failed to load movie details.
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

// Sub-components
const CastCard = ({ person }: { person: Cast }) => (
  <div className="flex-shrink-0 w-28 text-center">
    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-secondary mb-2">
      {person.profile_path ? (
        <OptimizedImage
          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
          alt={person.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
    <p className="text-sm font-medium line-clamp-1">{person.name}</p>
    <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
  </div>
);

const VideoCard = ({ video }: { video: Video }) => (
  <div 
    className="relative aspect-video rounded-lg overflow-hidden bg-secondary cursor-pointer group"
    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')}
  >
    <img
      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
      alt={video.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="bg-primary rounded-full p-3">
        <Play className="w-6 h-6 text-primary-foreground fill-current" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
      <p className="text-xs text-white line-clamp-1">{video.name}</p>
      <p className="text-xs text-white/60">{video.type}</p>
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 300;
  
  return (
    <div className="bg-secondary/30 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
          {review.author_details.avatar_path ? (
            <img
              src={review.author_details.avatar_path.startsWith('/http') 
                ? review.author_details.avatar_path.slice(1) 
                : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
              }
              alt={review.author}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium">
              {review.author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium">{review.author}</p>
            {review.author_details.rating && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1 fill-current text-primary" />
                {review.author_details.rating}/10
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className={`text-sm text-muted-foreground ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
        {review.content}
      </p>
      {isLong && (
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="px-0 h-auto text-primary"
        >
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </div>
  );
};

const SimilarMovieCard = ({ movie, onClick }: { movie: Movie; onClick?: () => void }) => (
  <div 
    className="cursor-pointer group"
    onClick={onClick}
  >
    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary mb-2">
      {movie.poster_path ? (
        <OptimizedImage
          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Film className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
    <p className="text-xs font-medium line-clamp-2">{movie.title}</p>
    <div className="flex items-center gap-1 mt-1">
      <Star className="w-3 h-3 text-primary fill-current" />
      <span className="text-xs text-muted-foreground">{movie.vote_average.toFixed(1)}</span>
    </div>
  </div>
);

export default MovieDetailModal;
