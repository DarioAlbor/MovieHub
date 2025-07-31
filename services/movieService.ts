import axios from 'axios'
import { useRuntimeConfig } from 'nuxt/app'

interface SearchResponse {
  Search: Movie[]
  totalResults: string
  Response: string
}

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface MovieDetails extends Movie {
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Ratings: { Source: string; Value: string }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
}

export const useMovieService = () => {
  const config = useRuntimeConfig()
  
  const apiEndpoint = config.public.omdbApiUrl || ''
  const apiToken = config.public.omdbApiKey || ''
  
  const apiClient = axios.create({
    baseURL: apiEndpoint,
    params: {
      apikey: apiToken
    }
  })

  const searchMovies = async (title: string, page = 1) => {
    try {
      const response = await apiClient.get<SearchResponse>('', {
        params: {
          s: title,
          page
        }
      })
      
      return response.data
    } catch (error) {
      return { Search: [], totalResults: "0", Response: "False" }
    }
  }
  
  const getMovieById = async (id: string) => {
    try {
      const response = await apiClient.get<MovieDetails>('', {
        params: {
          i: id,
          plot: 'full'
        }
      })
      
      return response.data
    } catch (error) {
      throw new Error(`No se pudieron obtener los detalles de la película con ID: ${id}`)
    }
  }
  
  return {
    searchMovies,
    getMovieById
  }
} 