import { ref } from 'vue'
import { useMovieService } from '~/services/movieService'

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface MovieDetails {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
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
}

export const useMovies = () => {
  const movies = ref<Movie[]>([])
  const currentMovie = ref<MovieDetails | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalResults = ref(0)
  const currentPage = ref(1)
  
  const movieService = useMovieService()
  
  const searchMovies = async (title: string, page = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await movieService.searchMovies(title, page)
      
      if (response.Response === 'True') {
        movies.value = response.Search
        totalResults.value = parseInt(response.totalResults)
        currentPage.value = page
      } else {
        error.value = response.Response
        movies.value = []
      }
    } catch (err: any) {
      error.value = err.message || 'Error al buscar películas'
      movies.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  const getMovieDetails = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const movie = await movieService.getMovieById(id)
      currentMovie.value = movie
    } catch (err: any) {
      error.value = err.message || 'Error al obtener detalles de la película'
      currentMovie.value = null
    } finally {
      isLoading.value = false
    }
  }
  
  const loadMoreMovies = async (title: string) => {
    const nextPage = currentPage.value + 1
    await searchMovies(title, nextPage)
  }
  
  return {
    movies,
    currentMovie,
    isLoading,
    error,
    totalResults,
    currentPage,
    searchMovies,
    getMovieDetails,
    loadMoreMovies
  }
} 