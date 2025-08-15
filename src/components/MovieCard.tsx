import { Star, Clock, Calendar, Globe, Play, RotateCcw, Film, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import OptimizedImage from "@/components/OptimizedImage";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: Genre[];
  original_language: string;
  imdb_id?: string;
}

interface MovieCardProps {
  movie: Movie;
  onPickAnother: () => void;
  onWatchTrailer: (movieTitle: string) => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

const MovieCard = ({ movie, onPickAnother, onWatchTrailer, onToggleFavorite, isFavorite }: MovieCardProps) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating / 2) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-primary fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-primary fill-current opacity-50" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-muted-foreground" />);
      }
    }
    return stars;
  };

  const truncateOverview = (text: string, maxLength: number = 300) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card-cinema rounded-xl p-3 sm:p-4 md:p-4 lg:p-5 max-w-4xl mx-auto animate-fade-in-up">
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-5 items-start">
        {/* Movie Poster - Desktop */}
        <div className="relative group order-2 lg:order-1 hidden lg:block">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cinema-dark to-background">
            {posterUrl ? (
              <OptimizedImage
                src={posterUrl}
                alt={`${movie.title} movie poster`}
                className="w-full aspect-[2/3] object-cover transition-all duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-secondary rounded-lg flex items-center justify-center">
                <Film className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            
            {/* Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-cinema-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Floating Rating Badge */}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
              <Star className="w-3 h-3 text-cinema-gold fill-current" />
              <span className="text-sm font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cinema-gold/20 to-cinema-red/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
        </div>

        {/* Movie Details */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 order-1 lg:order-2">
          {/* Title with Mobile Poster */}
          <div className="space-y-2">
            <div className="flex gap-4 items-start lg:block">
              {/* Mobile Poster */}
              <div className="relative group lg:hidden flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-cinema-dark to-background w-20 sm:w-24">
                  {posterUrl ? (
                    <OptimizedImage
                      src={posterUrl}
                      alt={`${movie.title} movie poster`}
                      className="w-full aspect-[2/3] object-cover transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-secondary rounded-lg flex items-center justify-center">
                      <Film className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Title */}
              <div className="flex-1 lg:w-full">
                <h2 className="font-cinema text-2xl sm:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cinema-gold to-cinema-gold/80 leading-tight animate-slide-up">
                  {movie.title}
                </h2>
                <div className="h-1 w-16 lg:w-20 bg-gradient-to-r from-cinema-gold to-transparent rounded-full animate-scale-in mt-2" />
              </div>
            </div>
          </div>

          {/* Enhanced Rating Display */}
          <div className="flex items-center justify-between bg-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(movie.vote_average)}
              </div>
              <span className="text-lg font-bold text-cinema-gold">
                {movie.vote_average.toFixed(1)}/10
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Rating</p>
              <p className="text-sm font-medium">
                {movie.vote_average >= 8 ? "Excellent" : 
                 movie.vote_average >= 7 ? "Very Good" : 
                 movie.vote_average >= 6 ? "Good" : "Average"}
              </p>
            </div>
          </div>

          {/* Enhanced Genre Tags */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre, index) => (
                <Badge 
                  key={genre.id} 
                  variant="secondary"
                  className="bg-gradient-to-r from-cinema-dark to-secondary text-cinema-gold border border-cinema-gold/20 px-3 py-1 rounded-full text-sm font-medium hover:from-cinema-gold/10 hover:to-cinema-gold/5 transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slide-up 0.4s ease-out forwards'
                  }}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Enhanced Overview */}
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-4 border border-border/30">
            <h3 className="text-sm font-cinema text-cinema-gold mb-2 uppercase tracking-wider">Synopsis</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {truncateOverview(movie.overview)}
            </p>
          </div>

          {/* Enhanced Movie Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-3 text-center border border-border/30 hover:border-cinema-gold/30 transition-all duration-300">
              <Calendar className="w-4 h-4 mx-auto mb-1 text-cinema-gold" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Release</p>
              <p className="text-sm font-semibold">{releaseYear}</p>
            </div>
            
            {movie.runtime && (
              <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-3 text-center border border-border/30 hover:border-cinema-gold/30 transition-all duration-300">
                <Clock className="w-4 h-4 mx-auto mb-1 text-cinema-gold" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Runtime</p>
                <p className="text-sm font-semibold">{formatRuntime(movie.runtime)}</p>
              </div>
            )}
            
            <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-3 text-center border border-border/30 hover:border-cinema-gold/30 transition-all duration-300">
              <Globe className="w-4 h-4 mx-auto mb-1 text-cinema-gold" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Language</p>
              <p className="text-sm font-semibold">{movie.original_language.toUpperCase()}</p>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="pt-2">
            <TooltipProvider>
              <div className="flex justify-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onWatchTrailer(movie.title)}
                      className="group bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-glow-pulse"
                      size="icon"
                    >
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Watch Trailer</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onPickAnother}
                      className="group bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold font-semibold transition-all duration-300 transform hover:scale-105"
                      size="icon"
                    >
                      <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pick Another</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onToggleFavorite(movie)}
                      className={`group font-semibold transition-all duration-300 transform hover:scale-105 ${isFavorite 
                        ? "bg-gradient-to-r from-cinema-red to-cinema-red/90 text-white hover:from-cinema-red/90 hover:to-cinema-red" 
                        : "bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold"
                      }`}
                      size="icon"
                    >
                      <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? "fill-current scale-110" : "group-hover:scale-125"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        const imdbUrl = movie.imdb_id 
                          ? `https://www.imdb.com/title/${movie.imdb_id}/`
                          : `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}&ref_=nv_sr_sm`;
                        window.open(imdbUrl, '_blank');
                      }}
                      className="group bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold font-semibold transition-all duration-300 transform hover:scale-105"
                      size="icon"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on IMDB</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;