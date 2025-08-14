// Re-export types for backward compatibility
export * from './types'

// Re-export main services
export { MovieService } from './movie-service'
export { ApiClient } from './api-client'

// Legacy API compatibility - these will use edge functions when Supabase is connected
import { MovieService } from './movie-service'
import { Genre, Movie, Filters, MovieResponse, Cast, Video } from './types'
import { ApiClient } from './api-client'

// Main exports that use the new service architecture
export const fetchGenres = MovieService.fetchGenres.bind(MovieService)
export const discoverMovies = MovieService.discoverMovies.bind(MovieService)
export const discoverMoviesWithPagination = MovieService.discoverMoviesWithPagination.bind(MovieService)
export const getRandomMovie = MovieService.getRandomMovie.bind(MovieService)

// Updated functions that use the enhanced API client
export const getPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('popular', { filters: { page } })
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const getTopRatedMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('top-rated', { filters: { page } })
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const getNowPlayingMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('now-playing', { filters: { page } })
  } catch (error) {
    console.error('Error fetching now playing movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const getUpcomingMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('upcoming', { filters: { page } })
  } catch (error) {
    console.error('Error fetching upcoming movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('search', { filters: { query, page } })
  } catch (error) {
    console.error('Error searching movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const getMovieRecommendations = async (movieId: number, page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('recommendations', { movieId, filters: { page } })
  } catch (error) {
    console.error('Error fetching movie recommendations:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const getSimilarMovies = async (movieId: number, page: number = 1): Promise<MovieResponse> => {
  try {
    return await ApiClient.call('similar', { movieId, filters: { page } })
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: 1 }
  }
}

export const getMovieCast = async (movieId: number): Promise<Cast[]> => {
  try {
    const data = await ApiClient.call('credits', { movieId })
    return data.cast || []
  } catch (error) {
    console.error('Error fetching movie cast:', error)
    return []
  }
}

export const getMovieVideos = async (movieId: number): Promise<Video[]> => {
  try {
    const data = await ApiClient.call('videos', { movieId })
    return data.results || []
  } catch (error) {
    console.error('Error fetching movie videos:', error)
    return []
  }
}

export const getYouTubeTrailerUrl = async (movieId: number): Promise<string | null> => {
  try {
    const videos = await getMovieVideos(movieId)
    const trailer = videos.find(video => 
      video.site === 'YouTube' && 
      (video.type === 'Trailer' || video.type === 'Teaser')
    )
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
  } catch (error) {
    console.error('Error getting YouTube trailer URL:', error)
    return null
  }
}

export const getTrailerUrl = (movieTitle: string): string => {
  const query = encodeURIComponent(`${movieTitle} trailer`)
  return `https://www.youtube.com/results?search_query=${query}`
}