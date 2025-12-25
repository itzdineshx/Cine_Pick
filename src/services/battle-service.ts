import { ApiClient } from "./api-client";
import type { Movie, Cast, Video } from "./types";

export interface DetailedMovieData {
  cast: Cast[];
  videos: Video[];
  budget: number | null;
  revenue: number | null;
  popularity: number;
  vote_count: number;
  imdb_id?: string;
  runtime: number | null;
  release_date: string | null;
}

export interface ComparisonMetrics {
  ratingScore: number;
  popularityScore: number;
  voteCountScore: number;
  revenueScore: number;
  budgetScore: number;
  castSizeScore: number;
  runtimeScore: number;
  totalScore: number;
}

export class BattleService {
  static async fetchDetailedMovieData(movieId: number): Promise<DetailedMovieData> {
    try {
      // Use correct action names that match the fallback switch cases
      const [movieDetails, credits, videos] = await Promise.all([
        ApiClient.call('movie-details', { movieId }),
        ApiClient.call('credits', { movieId }),  // Fixed: was 'movie-credits'
        ApiClient.call('videos', { movieId })    // Fixed: was 'movie-videos'
      ]);

      return {
        cast: credits?.cast?.slice(0, 10) || [],
        videos: videos?.results?.filter((v: Video) => v.type === 'Trailer' && v.site === 'YouTube') || [],
        budget: movieDetails?.budget || null,
        revenue: movieDetails?.revenue || null,
        popularity: movieDetails?.popularity || 0,
        vote_count: movieDetails?.vote_count || 0,
        imdb_id: movieDetails?.imdb_id,
        runtime: movieDetails?.runtime || null,
        release_date: movieDetails?.release_date || null
      };
    } catch (error) {
      console.error('Error fetching detailed movie data:', error);
      return {
        cast: [],
        videos: [],
        budget: null,
        revenue: null,
        popularity: 0,
        vote_count: 0,
        runtime: null,
        release_date: null
      };
    }
  }

  static compareMovies(
    movie1: Movie,
    movie2: Movie,
    data1: DetailedMovieData,
    data2: DetailedMovieData
  ): ComparisonMetrics {
    // Rating score (0-10 scale)
    const ratingScore = movie1.vote_average - movie2.vote_average;

    // Popularity score
    const popularityScore = data1.popularity - data2.popularity;

    // Vote count score
    const voteCountScore = data1.vote_count - data2.vote_count;

    // Revenue score
    const revenueScore = (data1.revenue || 0) - (data2.revenue || 0);

    // Budget score
    const budgetScore = (data1.budget || 0) - (data2.budget || 0);

    // Cast size score
    const castSizeScore = data1.cast.length - data2.cast.length;

    // Runtime score (longer movies often indicate more content)
    const runtimeScore = (data1.runtime || 0) - (data2.runtime || 0);

    // Calculate total weighted score with improved algorithm
    // Weights: Rating 40%, Popularity 15%, Vote Count 15%, Revenue 15%, Budget 10%, Cast 5%
    const normalizedRating = ratingScore / 10; // -1 to 1
    const normalizedPopularity = popularityScore / Math.max(data1.popularity, data2.popularity, 1);
    const normalizedVotes = voteCountScore / Math.max(data1.vote_count, data2.vote_count, 1);
    const normalizedRevenue = revenueScore / Math.max(data1.revenue || 1, data2.revenue || 1, 1);
    const normalizedBudget = budgetScore / Math.max(data1.budget || 1, data2.budget || 1, 1);
    const normalizedCast = castSizeScore / Math.max(data1.cast.length, data2.cast.length, 1);

    const totalScore =
      normalizedRating * 40 +
      normalizedPopularity * 15 +
      normalizedVotes * 15 +
      normalizedRevenue * 15 +
      normalizedBudget * 10 +
      normalizedCast * 5;

    return {
      ratingScore,
      popularityScore,
      voteCountScore,
      revenueScore,
      budgetScore,
      castSizeScore,
      runtimeScore,
      totalScore
    };
  }

  static determineWinner(
    movie1: Movie,
    movie2: Movie,
    data1: DetailedMovieData,
    data2: DetailedMovieData
  ): Movie {
    const metrics = this.compareMovies(movie1, movie2, data1, data2);
    return metrics.totalScore > 0 ? movie1 : movie2;
  }
}