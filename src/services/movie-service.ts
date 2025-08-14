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

  // Get random movie from results, excluding already shown movies with pagination
  static async getRandomMovie(filters?: Filters, excludeIds: number[] = []): Promise<Movie | null> {
    try {
      // Get multiple random pages to increase variety
      const randomPage = Math.floor(Math.random() * 10) + 1
      const data = await ApiClient.call('discover', { 
        filters: { 
          ...filters, 
          page: randomPage,
          // Randomize sort order for more variety
          sortBy: this.getRandomSortOrder()
        } 
      })
      
      if (!data.results || data.results.length === 0) {
        return null
      }
      
      // Get detailed information for movies to ensure complete data
      const randomMovies = this.shuffleArray(data.results.slice(0, 10))
      
      for (const movie of randomMovies) {
        if (movie && typeof movie === 'object' && 'id' in movie) {
          const movieId = (movie as any).id
          if (!excludeIds.includes(movieId)) {
            const details = await this.fetchMovieDetails(movieId)
            if (details) {
              return details
            }
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting random movie:', error)
      return null
    }
  }

  // Helper method to randomize sort order for more variety
  private static getRandomSortOrder(): string {
    const sortOptions = [
      'popularity.desc',
      'vote_average.desc', 
      'release_date.desc',
      'vote_count.desc',
      'revenue.desc'
    ]
    return sortOptions[Math.floor(Math.random() * sortOptions.length)]
  }

  // Fisher-Yates shuffle algorithm for true randomization
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}