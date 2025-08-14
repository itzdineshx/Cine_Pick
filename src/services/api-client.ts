// API client for calling Supabase edge functions with TMDB fallback
const SUPABASE_FUNCTION_URL = '/functions/v1/tmdb-api'
const TMDB_API_KEY = 'ef27c42d7cb61ce7f383f99a10294657'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export class ApiClient {
  static async call(action: string, params: any = {}) {
    try {
      // Try Supabase edge function first
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...params }),
      })

      if (response.ok) {
        return await response.json()
      }

      // If edge function not available (404), fallback to direct TMDB API
      if (response.status === 404) {
        console.log(`Edge function not available, falling back to direct TMDB API for action: ${action}`)
        return await this.fallbackToTMDB(action, params)
      }

      throw new Error(`API error: ${response.status}`)
    } catch (error) {
      // If network error or edge function fails, try fallback
      console.log(`Edge function failed, falling back to direct TMDB API for action: ${action}`)
      return await this.fallbackToTMDB(action, params)
    }
  }

  private static async fallbackToTMDB(action: string, params: any = {}) {
    switch (action) {
      case 'genres':
        return await this.fetchGenresDirect()
      
      case 'discover':
        return await this.discoverMoviesDirect(params.filters)
      
      case 'movie-details':
        return await this.fetchMovieDetailsDirect(params.movieId)

      case 'popular':
        return await this.getPopularMoviesDirect(params.filters?.page || 1)

      case 'top-rated':
        return await this.getTopRatedMoviesDirect(params.filters?.page || 1)

      case 'now-playing':
        return await this.getNowPlayingMoviesDirect(params.filters?.page || 1)

      case 'upcoming':
        return await this.getUpcomingMoviesDirect(params.filters?.page || 1)

      case 'search':
        return await this.searchMoviesDirect(params.filters?.query, params.filters?.page || 1)

      case 'recommendations':
        return await this.getRecommendationsDirect(params.movieId, params.filters?.page || 1)

      case 'similar':
        return await this.getSimilarMoviesDirect(params.movieId, params.filters?.page || 1)

      case 'credits':
        return await this.getCreditsDirect(params.movieId)

      case 'videos':
        return await this.getVideosDirect(params.movieId)
      
      default:
        throw new Error(`No fallback available for action: ${action}`)
    }
  }

  private static async fetchGenresDirect() {
    const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async fetchMovieDetailsDirect(movieId: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async discoverMoviesDirect(filters: any) {
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&include_adult=false&include_video=false`
    
    if (filters) {
      url += `&page=${filters.page || 1}`
      url += `&sort_by=${filters.sortBy || 'popularity.desc'}`
      
      if (filters.genres && filters.genres.length > 0) {
        url += `&with_genres=${filters.genres.join(',')}`
      }
      
      if (filters.yearRange) {
        url += `&primary_release_date.gte=${filters.yearRange[0]}-01-01`
        url += `&primary_release_date.lte=${filters.yearRange[1]}-12-31`
      }
      
      if (filters.minRating > 0) {
        url += `&vote_average.gte=${filters.minRating}`
      }
      
      if (filters.language && filters.language !== 'en') {
        url += `&with_original_language=${filters.language}`
      }
      
      if (filters.runtime) {
        url += `&with_runtime.gte=${filters.runtime[0]}`
        url += `&with_runtime.lte=${filters.runtime[1]}`
      }
      
      if (filters.certification) {
        url += `&certification_country=US&certification=${filters.certification}`
      }
    } else {
      url += `&page=1`
    }
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getPopularMoviesDirect(page: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getTopRatedMoviesDirect(page: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getNowPlayingMoviesDirect(page: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getUpcomingMoviesDirect(page: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async searchMoviesDirect(query: string, page: number) {
    if (!query) throw new Error('Search query is required')
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&page=${page}&include_adult=false`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getRecommendationsDirect(movieId: number, page: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getSimilarMoviesDirect(movieId: number, page: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&page=${page}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getCreditsDirect(movieId: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }

  private static async getVideosDirect(movieId: number) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    return await response.json()
  }
}