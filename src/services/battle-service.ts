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
}

export interface ComparisonMetrics {
  ratingScore: number;
  popularityScore: number;
  voteCountScore: number;
  revenueScore: number;
  budgetScore: number;
  castSizeScore: number;
  totalScore: number;
}

export class BattleService {
  static async fetchDetailedMovieData(movieId: number): Promise<DetailedMovieData> {
    try {
      const [movieDetails, credits, videos] = await Promise.all([
        ApiClient.call('movie-details', { movieId }),
        ApiClient.call('movie-credits', { movieId }),
        ApiClient.call('movie-videos', { movieId })
      ]);

      return {
        cast: credits?.cast?.slice(0, 10) || [],
        videos: videos?.results?.filter((v: Video) => v.type === 'Trailer' && v.site === 'YouTube') || [],
        budget: movieDetails?.budget || null,
        revenue: movieDetails?.revenue || null,
        popularity: movieDetails?.popularity || 0,
        vote_count: movieDetails?.vote_count || 0,
        imdb_id: movieDetails?.imdb_id
      };
    } catch (error) {
      console.error('Error fetching detailed movie data:', error);
      return {
        cast: [],
        videos: [],
        budget: null,
        revenue: null,
        popularity: 0,
        vote_count: 0
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

    // Calculate total weighted score
    const totalScore =
      ratingScore * 2 + // Rating is most important
      (popularityScore / 100) + // Normalize popularity
      (voteCountScore / 1000) + // Normalize vote count
      (revenueScore / 100000000) + // Normalize revenue
      (budgetScore / 50000000) + // Normalize budget
      castSizeScore * 0.5; // Cast size has small weight

    return {
      ratingScore,
      popularityScore,
      voteCountScore,
      revenueScore,
      budgetScore,
      castSizeScore,
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
