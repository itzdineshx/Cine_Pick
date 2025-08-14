import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, filters, movieId, query, page } = await req.json()
    
    // Get TMDB API key from Supabase secrets
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY')
    if (!tmdbApiKey) {
      throw new Error('TMDB API key not configured')
    }

    const baseUrl = 'https://api.themoviedb.org/3'
    
    let response
    
    switch (action) {
      case 'genres':
        response = await fetch(`${baseUrl}/genre/movie/list?api_key=${tmdbApiKey}`)
        break
        
      case 'discover':
        let url = `${baseUrl}/discover/movie?api_key=${tmdbApiKey}&include_adult=false&include_video=false`
        
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
        
        response = await fetch(url)
        break
        
      case 'movie-details':
        response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${tmdbApiKey}`)
        break

      case 'popular':
        response = await fetch(`${baseUrl}/movie/popular?api_key=${tmdbApiKey}&page=${filters?.page || 1}`)
        break

      case 'top-rated':
        response = await fetch(`${baseUrl}/movie/top_rated?api_key=${tmdbApiKey}&page=${filters?.page || 1}`)
        break

      case 'now-playing':
        response = await fetch(`${baseUrl}/movie/now_playing?api_key=${tmdbApiKey}&page=${filters?.page || 1}`)
        break

      case 'upcoming':
        response = await fetch(`${baseUrl}/movie/upcoming?api_key=${tmdbApiKey}&page=${filters?.page || 1}`)
        break

      case 'search':
        const { query, page } = filters || {}
        if (!query) {
          throw new Error('Search query is required')
        }
        const encodedQuery = encodeURIComponent(query)
        response = await fetch(`${baseUrl}/search/movie?api_key=${tmdbApiKey}&query=${encodedQuery}&page=${page || 1}&include_adult=false`)
        break

      case 'recommendations':
        response = await fetch(`${baseUrl}/movie/${movieId}/recommendations?api_key=${tmdbApiKey}&page=${filters?.page || 1}`)
        break

      case 'similar':
        response = await fetch(`${baseUrl}/movie/${movieId}/similar?api_key=${tmdbApiKey}&page=${filters?.page || 1}`)
        break

      case 'credits':
        response = await fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${tmdbApiKey}`)
        break

      case 'videos':
        response = await fetch(`${baseUrl}/movie/${movieId}/videos?api_key=${tmdbApiKey}`)
        break
        
      default:
        throw new Error(`Invalid action: ${action}`)
    }

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in tmdb-api function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Check if TMDB_API_KEY is set in Supabase secrets'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})