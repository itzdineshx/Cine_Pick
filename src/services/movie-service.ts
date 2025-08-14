import { ApiClient } from './api-client'
import { Genre, Movie, Filters, MovieResponse } from './types'

export class MovieService {
  // Fetch all available genres
  static async fetchGenres(): Promise<Genre[]> {
    try {
      const data = await ApiClient.call('genres')
      return data.genres || []
    } catch (error) {
      console.error('Error fetching genres:', error)
      return []
    }
  }

  // Fetch movie details
  static async fetchMovieDetails(movieId: number): Promise<Movie | null> {
    try {
      const data = await ApiClient.call('movie-details', { movieId })
      return data
    } catch (error) {
      console.error('Error fetching movie details:', error)
      return null
    }
  }

  // Discover movies with filters
  static async discoverMovies(filters?: Filters): Promise<Movie[]> {
    try {
      const data = await ApiClient.call('discover', { filters })
      
      // Fetch detailed information for each movie to get genres
      const moviesWithDetails = await Promise.all(
        data.results.slice(0, 20).map(async (movie: any) => {
          const details = await this.fetchMovieDetails(movie.id)
          return details
        })
      )
      
      return moviesWithDetails.filter(Boolean) as Movie[]
    } catch (error) {
      console.error('Error discovering movies:', error)
      return []
    }
  }

  // Enhanced discover movies with pagination support
  static async discoverMoviesWithPagination(filters?: Filters): Promise<MovieResponse> {
    try {
      const data = await ApiClient.call('discover', { filters })
      return data
    } catch (error) {
      console.error('Error discovering movies with pagination:', error)
      return { results: [], total_pages: 0, total_results: 0, page: 1 }
    }
  }

  // Get random movie from results, excluding already shown movies
  static async getRandomMovie(filters?: Filters, excludeIds: number[] = []): Promise<Movie | null> {
    try {
      const movies = await this.discoverMovies(filters)
      const availableMovies = movies.filter(movie => !excludeIds.includes(movie.id))
      
      if (availableMovies.length === 0) {
        return null
      }
      
      const randomIndex = Math.floor(Math.random() * availableMovies.length)
      return availableMovies[randomIndex]
    } catch (error) {
      console.error('Error getting random movie:', error)
      return null
    }
  }
}