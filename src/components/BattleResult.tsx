import { Trophy, Star, Calendar, Clock, Film, DollarSign, TrendingUp, Users, Award, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage";
import type { Movie } from "@/services/tmdb";
import type { DetailedMovieData, ComparisonMetrics } from "@/services/battle-service";

interface BattleResultProps {
  movie1: Movie;
  movie2: Movie;
  winner: Movie;
  detailedData1?: DetailedMovieData;
  detailedData2?: DetailedMovieData;
  metrics?: ComparisonMetrics;
}

const BattleResult = ({ movie1, movie2, winner, detailedData1, detailedData2, metrics }: BattleResultProps) => {
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatNumber = (num: number | null) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  const MovieDisplay = ({ movie, isWinner, detailedData }: { movie: Movie; isWinner: boolean; detailedData?: DetailedMovieData }) => (
    <div className={`relative ${isWinner ? 'scale-105' : 'opacity-90'} transition-all duration-500`}>
      {isWinner && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl">
            <Trophy className="w-6 h-6" />
            <span className="font-cinema text-xl">WINNER</span>
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
        
        <h3 className="font-cinema text-2xl text-cinema-gold mb-3">{movie.title}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-cinema-gold fill-current" />
            <span className="text-foreground font-semibold text-lg">{movie.vote_average.toFixed(1)}/10</span>
            <span className="text-muted-foreground text-sm">({formatNumber(detailedData?.vote_count || 0)} votes)</span>
          </div>
          
          {detailedData?.imdb_id && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-cinema-gold" />
              <span className="text-muted-foreground">IMDb: {detailedData.imdb_id}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
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
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cinema-gold" />
              <span className="text-muted-foreground">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cinema-gold" />
                <span className="text-muted-foreground">{formatRuntime(movie.runtime)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cinema-gold" />
              <span className="text-muted-foreground">{detailedData?.popularity?.toFixed(0) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cinema-gold" />
              <span className="text-muted-foreground">{detailedData?.cast?.length || 0} cast</span>
            </div>
          </div>

          {(detailedData?.budget || detailedData?.revenue) && (
            <div className="space-y-2 pt-2 border-t border-border">
              {detailedData?.budget && detailedData.budget > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-cinema-gold" />
                    Budget
                  </span>
                  <span className="text-foreground font-semibold">{formatCurrency(detailedData.budget)}</span>
                </div>
              )}
              {detailedData?.revenue && detailedData.revenue > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-cinema-gold" />
                    Revenue
                  </span>
                  <span className="text-foreground font-semibold">{formatCurrency(detailedData.revenue)}</span>
                </div>
              )}
            </div>
          )}

          {detailedData?.videos && detailedData.videos.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Video className="w-4 h-4 text-cinema-gold" />
              <span className="text-muted-foreground">{detailedData.videos.length} trailers</span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mt-4 line-clamp-3">
          {movie.overview}
        </p>

        {detailedData?.cast && detailedData.cast.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-cinema-gold mb-2">Top Cast</h4>
            <div className="flex flex-wrap gap-2">
              {detailedData.cast.slice(0, 4).map((actor) => (
                <span key={actor.id} className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {actor.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-cinema text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cinema-gold via-cinema-gold to-cinema-gold/80 mb-4">
          Battle Results
        </h2>
        <p className="text-muted-foreground text-lg">
          The ultimate movie showdown winner has been crowned!
        </p>
      </div>

      {metrics && (
        <div className="card-cinema rounded-xl p-6 mb-8">
          <h3 className="font-cinema text-2xl text-cinema-gold mb-4 text-center">Comparison Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Star className="w-5 h-5 text-cinema-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Rating</p>
              <p className="font-semibold text-sm">{metrics.ratingScore > 0 ? movie1.title.split(' ')[0] : movie2.title.split(' ')[0]}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-cinema-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Popularity</p>
              <p className="font-semibold text-sm">{metrics.popularityScore > 0 ? movie1.title.split(' ')[0] : movie2.title.split(' ')[0]}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Users className="w-5 h-5 text-cinema-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Votes</p>
              <p className="font-semibold text-sm">{metrics.voteCountScore > 0 ? movie1.title.split(' ')[0] : movie2.title.split(' ')[0]}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-cinema-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Revenue</p>
              <p className="font-semibold text-sm">{metrics.revenueScore > 0 ? movie1.title.split(' ')[0] : movie2.title.split(' ')[0]}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-cinema-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Budget</p>
              <p className="font-semibold text-sm">{metrics.budgetScore > 0 ? movie1.title.split(' ')[0] : movie2.title.split(' ')[0]}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Users className="w-5 h-5 text-cinema-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Cast Size</p>
              <p className="font-semibold text-sm">{metrics.castSizeScore > 0 ? movie1.title.split(' ')[0] : movie2.title.split(' ')[0]}</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
            <div className="flex justify-center items-center gap-4">
              <div className={`text-2xl font-bold ${winner.id === movie1.id ? 'text-cinema-gold' : 'text-muted-foreground'}`}>
                {movie1.title.split(' ')[0]}: {metrics.totalScore > 0 ? Math.abs(metrics.totalScore) : 0}
              </div>
              <span className="text-muted-foreground">vs</span>
              <div className={`text-2xl font-bold ${winner.id === movie2.id ? 'text-cinema-gold' : 'text-muted-foreground'}`}>
                {movie2.title.split(' ')[0]}: {metrics.totalScore < 0 ? Math.abs(metrics.totalScore) : 0}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <MovieDisplay movie={movie1} isWinner={winner.id === movie1.id} detailedData={detailedData1} />
        <MovieDisplay movie={movie2} isWinner={winner.id === movie2.id} detailedData={detailedData2} />
      </div>
    </div>
  );
};

export default BattleResult;
