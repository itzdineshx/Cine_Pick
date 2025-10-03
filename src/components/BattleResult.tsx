import { Trophy, Star, Calendar, Clock, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage";
import type { Movie } from "@/services/tmdb";

interface BattleResultProps {
  movie1: Movie;
  movie2: Movie;
  winner: Movie;
}

const BattleResult = ({ movie1, movie2, winner }: BattleResultProps) => {
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const MovieDisplay = ({ movie, isWinner }: { movie: Movie; isWinner: boolean }) => (
    <div className={`relative ${isWinner ? 'scale-105' : 'opacity-60'} transition-all duration-500`}>
      {isWinner && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background px-6 py-2 rounded-full flex items-center gap-2 shadow-2xl">
            <Trophy className="w-5 h-5" />
            <span className="font-cinema text-lg">WINNER</span>
          </div>
        </div>
      )}
      
      <div className={`card-cinema rounded-xl p-6 ${isWinner ? 'ring-4 ring-cinema-gold animate-glow-pulse' : ''}`}>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cinema-dark to-background mb-4">
          {movie.poster_path ? (
            <OptimizedImage
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">
              <Film className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <h3 className="font-cinema text-2xl text-cinema-gold mb-2">{movie.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-cinema-gold fill-current" />
          <span className="text-foreground font-semibold">{movie.vote_average.toFixed(1)}/10</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genres?.slice(0, 3).map((genre) => (
            <Badge 
              key={genre.id}
              variant="secondary"
              className="bg-cinema-dark text-cinema-gold border border-cinema-gold/20"
            >
              {genre.name}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cinema-gold" />
            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
          </div>
          {movie.runtime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cinema-gold" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mt-4 line-clamp-4">
          {movie.overview}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-cinema text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cinema-gold to-cinema-gold/80 mb-2">
          Battle Results
        </h2>
        <p className="text-muted-foreground">
          The winner has been decided!
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <MovieDisplay movie={movie1} isWinner={winner.id === movie1.id} />
        <MovieDisplay movie={movie2} isWinner={winner.id === movie2.id} />
      </div>
    </div>
  );
};

export default BattleResult;
