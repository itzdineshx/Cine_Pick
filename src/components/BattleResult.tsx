import { Trophy, Star, Calendar, Clock, Film, DollarSign, TrendingUp, Users, Award, Video, ThumbsUp, BarChart3, Percent, CheckCircle2, XCircle, Timer } from "lucide-react";
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
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined || num === 0) return '0';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  const getYear = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  };

  // Calculate win counts for summary
  const getWinCounts = () => {
    if (!metrics) return { movie1Wins: 0, movie2Wins: 0 };
    let movie1Wins = 0;
    let movie2Wins = 0;
    
    if (metrics.ratingScore > 0) movie1Wins++; else if (metrics.ratingScore < 0) movie2Wins++;
    if (metrics.popularityScore > 0) movie1Wins++; else if (metrics.popularityScore < 0) movie2Wins++;
    if (metrics.voteCountScore > 0) movie1Wins++; else if (metrics.voteCountScore < 0) movie2Wins++;
    if (metrics.revenueScore > 0) movie1Wins++; else if (metrics.revenueScore < 0) movie2Wins++;
    if (metrics.budgetScore > 0) movie1Wins++; else if (metrics.budgetScore < 0) movie2Wins++;
    if (metrics.castSizeScore > 0) movie1Wins++; else if (metrics.castSizeScore < 0) movie2Wins++;
    if (metrics.runtimeScore > 0) movie1Wins++; else if (metrics.runtimeScore < 0) movie2Wins++;
    
    return { movie1Wins, movie2Wins };
  };

  const { movie1Wins, movie2Wins } = getWinCounts();

  const MetricComparisonBar = ({ 
    label, 
    icon: Icon, 
    value1, 
    value2, 
    format = 'number',
    higherIsBetter = true 
  }: { 
    label: string; 
    icon: React.ElementType;
    value1: number | null; 
    value2: number | null;
    format?: 'number' | 'currency' | 'percent' | 'raw' | 'runtime';
    higherIsBetter?: boolean;
  }) => {
    const v1 = value1 || 0;
    const v2 = value2 || 0;
    const max = Math.max(v1, v2) || 1;
    const percent1 = (v1 / max) * 100;
    const percent2 = (v2 / max) * 100;
    
    const winner1 = higherIsBetter ? v1 > v2 : v1 < v2;
    const winner2 = higherIsBetter ? v2 > v1 : v2 < v1;
    const tie = v1 === v2;

    const formatValue = (val: number | null) => {
      if (val === null || val === 0) return 'N/A';
      switch (format) {
        case 'currency': return formatCurrency(val);
        case 'percent': return `${val.toFixed(1)}%`;
        case 'raw': return val.toFixed(1);
        case 'runtime': return formatRuntime(val);
        default: return formatNumber(val);
      }
    };

    return (
      <div className="bg-background/30 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-cinema-gold" />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
          {/* Movie 1 */}
          <div className="text-right">
            <div className={`text-lg font-bold ${winner1 && !tie ? 'text-green-400' : 'text-foreground'}`}>
              {formatValue(value1)}
            </div>
            <div className="mt-1">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${winner1 && !tie ? 'bg-green-500' : 'bg-cinema-gold/60'}`}
                  style={{ width: `${percent1}%`, marginLeft: 'auto' }}
                />
              </div>
            </div>
          </div>
          
          {/* Winner indicator */}
          <div className="flex items-center justify-center w-8">
            {tie ? (
              <span className="text-muted-foreground text-xs">=</span>
            ) : winner1 ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400/50" />
            )}
          </div>
          
          {/* Movie 2 */}
          <div className="text-left">
            <div className={`text-lg font-bold ${winner2 && !tie ? 'text-green-400' : 'text-foreground'}`}>
              {formatValue(value2)}
            </div>
            <div className="mt-1">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${winner2 && !tie ? 'bg-green-500' : 'bg-cinema-gold/60'}`}
                  style={{ width: `${percent2}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MovieCard = ({ movie, isWinner, detailedData, position }: { movie: Movie; isWinner: boolean; detailedData?: DetailedMovieData; position: 'left' | 'right' }) => (
    <div className={`relative ${isWinner ? 'scale-[1.02]' : 'opacity-85'} transition-all duration-500`}>
      {isWinner && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-cinema-gold to-yellow-500 text-background px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl animate-pulse">
            <Trophy className="w-5 h-5" />
            <span className="font-cinema text-sm">WINNER</span>
          </div>
        </div>
      )}
      
      <div className={`card-cinema rounded-xl overflow-hidden ${isWinner ? 'ring-2 ring-cinema-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]' : ''}`}>
        {/* Poster */}
        <div className="relative h-64 overflow-hidden">
          {movie.poster_path ? (
            <OptimizedImage
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Film className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-cinema-gold fill-current" />
            <span className="text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>
          
          {detailedData?.imdb_id && (
            <div className="absolute bottom-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              IMDb
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-cinema text-xl text-cinema-gold mb-2 line-clamp-1">{movie.title}</h3>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres?.slice(0, 3).map((genre) => (
              <Badge 
                key={genre.id}
                variant="outline"
                className="text-xs border-cinema-gold/30 text-cinema-gold/80"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cinema-gold" />
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </div>
            {movie.runtime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cinema-gold" />
                {formatRuntime(movie.runtime)}
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {movie.overview}
          </p>

          {/* Cast preview */}
          {detailedData?.cast && detailedData.cast.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs text-cinema-gold mb-1">Top Cast</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {detailedData.cast.slice(0, 3).map(c => c.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Winner Announcement */}
      <div className="text-center bg-gradient-to-r from-cinema-gold/10 via-cinema-gold/20 to-cinema-gold/10 rounded-2xl p-8 border border-cinema-gold/30">
        <Trophy className="w-16 h-16 text-cinema-gold mx-auto mb-4 animate-bounce" />
        <h2 className="font-cinema text-3xl sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cinema-gold via-yellow-400 to-cinema-gold mb-3">
          {winner.title}
        </h2>
        <p className="text-lg text-cinema-gold/80 mb-2">Wins the Battle!</p>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Based on comprehensive analysis of ratings, popularity, revenue, and other metrics from TMDb and IMDb data.
        </p>
        
        {/* Win summary */}
        <div className="flex justify-center gap-8 mt-6">
          <div className={`text-center ${winner.id === movie1.id ? 'text-green-400' : 'text-muted-foreground'}`}>
            <p className="text-3xl font-bold">{movie1Wins}</p>
            <p className="text-xs">{movie1.title.split(' ')[0]} wins</p>
          </div>
          <div className="text-muted-foreground text-2xl">vs</div>
          <div className={`text-center ${winner.id === movie2.id ? 'text-green-400' : 'text-muted-foreground'}`}>
            <p className="text-3xl font-bold">{movie2Wins}</p>
            <p className="text-xs">{movie2.title.split(' ')[0]} wins</p>
          </div>
        </div>
      </div>

      {/* Movie Cards Side by Side */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MovieCard movie={movie1} isWinner={winner.id === movie1.id} detailedData={detailedData1} position="left" />
        <MovieCard movie={movie2} isWinner={winner.id === movie2.id} detailedData={detailedData2} position="right" />
      </div>

      {/* Detailed Metrics Comparison */}
      <div className="card-cinema rounded-xl p-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-cinema-gold" />
          <h3 className="font-cinema text-2xl text-cinema-gold">Detailed Comparison</h3>
        </div>
        
        {/* Header with movie names */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 mb-4 px-4">
          <div className="text-right">
            <span className={`font-semibold ${winner.id === movie1.id ? 'text-cinema-gold' : 'text-foreground'}`}>
              {movie1.title}
            </span>
          </div>
          <div className="w-8" />
          <div className="text-left">
            <span className={`font-semibold ${winner.id === movie2.id ? 'text-cinema-gold' : 'text-foreground'}`}>
              {movie2.title}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <MetricComparisonBar 
            label="User Rating (TMDb)" 
            icon={Star}
            value1={movie1.vote_average} 
            value2={movie2.vote_average}
            format="raw"
          />
          
          <MetricComparisonBar 
            label="Vote Count" 
            icon={ThumbsUp}
            value1={detailedData1?.vote_count || 0} 
            value2={detailedData2?.vote_count || 0}
          />
          
          <MetricComparisonBar 
            label="Popularity Score" 
            icon={TrendingUp}
            value1={detailedData1?.popularity || 0} 
            value2={detailedData2?.popularity || 0}
          />
          
          <MetricComparisonBar 
            label="Box Office Revenue" 
            icon={DollarSign}
            value1={detailedData1?.revenue || 0} 
            value2={detailedData2?.revenue || 0}
            format="currency"
          />
          
          <MetricComparisonBar 
            label="Production Budget" 
            icon={DollarSign}
            value1={detailedData1?.budget || 0} 
            value2={detailedData2?.budget || 0}
            format="currency"
          />
          
          {/* ROI Calculation */}
          {detailedData1?.revenue && detailedData1?.budget && detailedData2?.revenue && detailedData2?.budget && (
            <MetricComparisonBar 
              label="Return on Investment" 
              icon={Percent}
              value1={((detailedData1.revenue - detailedData1.budget) / detailedData1.budget) * 100} 
              value2={((detailedData2.revenue - detailedData2.budget) / detailedData2.budget) * 100}
              format="percent"
            />
          )}
          
          <MetricComparisonBar 
            label="Runtime" 
            icon={Timer}
            value1={detailedData1?.runtime || 0} 
            value2={detailedData2?.runtime || 0}
            format="runtime"
          />
          
          <MetricComparisonBar 
            label="Cast Size" 
            icon={Users}
            value1={detailedData1?.cast?.length || 0} 
            value2={detailedData2?.cast?.length || 0}
          />
          
          <MetricComparisonBar 
            label="Available Trailers" 
            icon={Video}
            value1={detailedData1?.videos?.length || 0} 
            value2={detailedData2?.videos?.length || 0}
          />
        </div>

        {/* Algorithm explanation */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Winner determined by weighted algorithm: Rating (40%) + Popularity (15%) + Vote Count (15%) + Revenue (15%) + Budget (10%) + Cast (5%)
          </p>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Movie 1 Full Stats */}
        <div className={`card-cinema rounded-xl p-5 ${winner.id === movie1.id ? 'ring-1 ring-cinema-gold/50' : ''}`}>
          <h4 className="font-cinema text-lg text-cinema-gold mb-4 flex items-center gap-2">
            {winner.id === movie1.id && <Trophy className="w-4 h-4" />}
            {movie1.title} - Full Stats
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">TMDb Rating</span><span>{movie1.vote_average.toFixed(1)}/10</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Vote Count</span><span>{formatNumber(detailedData1?.vote_count)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Popularity</span><span>{detailedData1?.popularity?.toFixed(0) || '0'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Release Year</span><span>{getYear(detailedData1?.release_date)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Runtime</span><span>{formatRuntime(detailedData1?.runtime || null)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span>{formatCurrency(detailedData1?.budget || null)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span>{formatCurrency(detailedData1?.revenue || null)}</span></div>
            {detailedData1?.imdb_id && <div className="flex justify-between"><span className="text-muted-foreground">IMDb ID</span><span className="text-yellow-500">{detailedData1.imdb_id}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Cast Members</span><span>{detailedData1?.cast?.length || 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Trailers</span><span>{detailedData1?.videos?.length || 0}</span></div>
          </div>
        </div>
        
        {/* Movie 2 Full Stats */}
        <div className={`card-cinema rounded-xl p-5 ${winner.id === movie2.id ? 'ring-1 ring-cinema-gold/50' : ''}`}>
          <h4 className="font-cinema text-lg text-cinema-gold mb-4 flex items-center gap-2">
            {winner.id === movie2.id && <Trophy className="w-4 h-4" />}
            {movie2.title} - Full Stats
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">TMDb Rating</span><span>{movie2.vote_average.toFixed(1)}/10</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Vote Count</span><span>{formatNumber(detailedData2?.vote_count)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Popularity</span><span>{detailedData2?.popularity?.toFixed(0) || '0'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Release Year</span><span>{getYear(detailedData2?.release_date)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Runtime</span><span>{formatRuntime(detailedData2?.runtime || null)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span>{formatCurrency(detailedData2?.budget || null)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span>{formatCurrency(detailedData2?.revenue || null)}</span></div>
            {detailedData2?.imdb_id && <div className="flex justify-between"><span className="text-muted-foreground">IMDb ID</span><span className="text-yellow-500">{detailedData2.imdb_id}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Cast Members</span><span>{detailedData2?.cast?.length || 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Trailers</span><span>{detailedData2?.videos?.length || 0}</span></div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Data sourced from TMDb (The Movie Database) • IMDb IDs linked for reference</p>
      </div>
    </div>
  );
};

export default BattleResult;