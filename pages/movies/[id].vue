<template>
  <div class="min-h-screen bg-black">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <div v-if="movieDetails" class="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <img
        :src="movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/1400x800?text=No+Image'"
        :alt="movieDetails.Title"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Gradientes -->
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

      <!-- Contenido -->
      <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12">
        <div class="max-w-4xl">
          <!-- Título de la película -->
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">{{ movieDetails.Title }}</h1>

          <!-- Información básica -->
          <div class="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-4 text-xs sm:text-sm text-gray-300">
            <div class="flex items-center">
              <StarIcon class="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-current mr-1" />
              <span class="text-white font-bold">{{ movieDetails.imdbRating }}</span>
            </div>
            <span>{{ movieDetails.Year }}</span>
            <div class="border border-gray-500 text-gray-300 px-1 md:px-2 py-0.5 rounded-md text-xs">
              {{ movieDetails.Rated }}
            </div>
            <div class="flex items-center">
              <ClockIcon class="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span>{{ movieDetails.Runtime }}</span>
            </div>
          </div>

          <!-- Géneros -->
          <div class="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-6">
            <span 
              v-for="genre in movieDetails.Genre.split(', ')" 
              :key="genre" 
              class="bg-gray-800 text-white hover:bg-gray-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm"
            >
              {{ genre }}
            </span>
          </div>

          <!-- Sinopsis -->
          <p class="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-8 max-w-2xl text-shadow line-clamp-4">{{ movieDetails.Plot }}</p>

          <!-- Botones de acción -->
          <div class="flex items-center flex-wrap gap-2 md:gap-4">
            <button class="bg-white text-black hover:bg-gray-200 font-bold px-3 md:px-8 py-2 md:py-3 text-sm md:text-lg flex items-center space-x-1 md:space-x-2 rounded">
              <PlayIcon class="h-4 w-4 md:h-5 md:w-5 fill-current" />
              <span>Reproducir</span>
            </button>

            <div class="flex items-center space-x-2">
              <button class="bg-gray-600 bg-opacity-70 text-white hover:bg-gray-500 font-bold p-2 md:p-3 rounded-full">
                <PlusIcon class="h-4 w-4 md:h-5 md:w-5" />
              </button>

              <button class="bg-gray-600 bg-opacity-70 text-white hover:bg-gray-500 font-bold p-2 md:p-3 rounded-full">
                <ThumbsUpIcon class="h-4 w-4 md:h-5 md:w-5" />
              </button>

              <button class="bg-gray-600 bg-opacity-70 text-white hover:bg-gray-500 font-bold p-2 md:p-3 rounded-full">
                <ShareIcon class="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="isLoading" class="flex flex-col justify-center items-center h-screen bg-black">
      <div class="netflix-loader">
        <div class="netflix-loader-bar"></div>
        <div class="netflix-loader-bar"></div>
        <div class="netflix-loader-bar"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="errorMessage" class="flex justify-center items-center h-[80vh]">
      <p class="text-xl text-red-500">{{ errorMessage }}</p>
    </div>

    <!-- Información detallada -->
    <div v-if="movieDetails" class="max-w-7xl mx-auto p-4 sm:p-6 md:p-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
        <!-- Columna principal -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          <!-- Reparto -->
          <section>
            <h2 class="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Reparto</h2>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 md:gap-4">
              <div v-for="(actor, index) in movieDetails.Actors.split(', ')" :key="index" class="text-center">
                <div class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-800 rounded-full mx-auto mb-1 md:mb-2 flex items-center justify-center">
                  <span class="text-gray-400 text-[8px] sm:text-xs">Foto</span>
                </div>
                <h3 class="text-white font-medium text-xs sm:text-sm line-clamp-1">{{ actor }}</h3>
                <p class="text-gray-400 text-[8px] sm:text-xs">Actor</p>
              </div>
            </div>
          </section>

          <!-- Más películas similares -->
          <section v-if="relatedMovies.length > 0">
            <h2 class="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Más como esto</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
              <div 
                v-for="movie in relatedMovies" 
                :key="movie.id"
                class="relative group cursor-pointer"
              >
                <NuxtLink :to="`/movies/${movie.id}`">
                  <img
                    :src="movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/200x300?text=No+Image'"
                    :alt="movie.title"
                    class="w-full h-auto rounded-md group-hover:scale-105 transition-transform"
                  />
                </NuxtLink>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6 md:space-y-8">
          <!-- Información técnica -->
          <section>
            <h2 class="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Información</h2>
            <div class="bg-gray-900 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4">
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">Director</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Director }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">Guionistas</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Writer }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">Año de lanzamiento</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Year }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">Duración</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Runtime }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">Clasificación</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Rated }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">País</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Country }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs md:text-sm">Idioma</span>
                <span class="text-white font-medium text-sm md:text-base">{{ movieDetails.Language }}</span>
              </div>
            </div>
          </section>

          <!-- Premios -->
          <section v-if="movieDetails.Awards && movieDetails.Awards !== 'N/A'">
            <h2 class="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Premios y reconocimientos</h2>
            <div class="bg-gray-900 rounded-lg p-4 md:p-6">
              <div class="text-gray-300 flex items-start text-sm md:text-base">
                <StarIcon class="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-current mr-2 mt-0.5 flex-shrink-0" />
                {{ movieDetails.Awards }}
              </div>
            </div>
          </section>

          <!-- Calificaciones -->
          <section v-if="movieDetails.Ratings && movieDetails.Ratings.length > 0">
            <h2 class="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Calificaciones</h2>
            <div class="bg-gray-900 rounded-lg p-4 md:p-6">
              <ul class="space-y-2 md:space-y-3">
                <li v-for="(rating, index) in movieDetails.Ratings" :key="index" class="text-gray-300 flex items-start text-sm md:text-base">
                  <StarIcon class="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-current mr-2 mt-0.5 flex-shrink-0" />
                  {{ rating.Source }}: {{ rating.Value }}
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Star as StarIcon, 
  Clock as ClockIcon, 
  Play as PlayIcon, 
  Plus as PlusIcon, 
  ThumbsUp as ThumbsUpIcon, 
  Share as ShareIcon 
} from 'lucide-vue-next'
import { useMovies } from '~/composables/useMovies'
import { useMovieService } from '~/services/movieService'
import Navbar from '~/components/ui/navbar.vue'
import { useSeo } from '~/composables/useSeo'

interface RelatedMovie {
  id: string;
  title: string;
  poster: string;
  year: string;
}

definePageMeta({
  middleware: ['auth'],
  layout: 'movie'
})

const route = useRoute()
const router = useRouter()
const movieId = route.params.id as string
const { currentMovie: movieDetails, isLoading, error: errorMessage, getMovieDetails } = useMovies()
const movieService = useMovieService()

const relatedMovies = ref<RelatedMovie[]>([])

const fetchRelatedMovies = async () => {
  if (movieDetails.value && movieDetails.value.Genre) {
    try {
      const firstGenre = movieDetails.value.Genre.split(',')[0].trim()
      const response = await movieService.searchMovies(firstGenre)
      
      if (response.Response === 'True') {
        const filtered = response.Search
          .filter(m => m.imdbID !== movieDetails.value?.imdbID)
          .slice(0, 8)
          .map(m => ({
            id: m.imdbID,
            title: m.Title,
            poster: m.Poster,
            year: m.Year
          }))
        
        relatedMovies.value = filtered
      }
    } catch (err) {
      // Manejar error silenciosamente
    }
  }
}

const loadMovieDetails = async (id: string) => {
  if (!id) {
    router.push('/movies')
    return
  }

  try {
    await getMovieDetails(id)
    
    if (movieDetails.value) {
      fetchRelatedMovies()
    } else {
      if (!isLoading.value) {
        router.push('/movies')
      }
    }
  } catch (err) {
    // Error manejado por el composable
  }
}

onMounted(() => {
  loadMovieDetails(movieId)
})

watch(() => route.params.id, (newId) => {
  if (newId && newId !== movieId) {
    loadMovieDetails(newId as string)
  }
})

const updateMovieSeo = (movie: any) => {
  if (movie && movie.Title) {
    useSeo({
      title: `${movie.Title} - MovieHub`,
      description: movie.Plot || `Detalles de la película ${movie.Title} en MovieHub.`,
      keywords: `${movie.Title}, ${movie.Genre || ''}, ${movie.Director || ''}, películas, streaming, MovieHub`,
      url: `https://moviehub-verifarma.vercel.app/movies/${movie.imdbID}`,
      image: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/favicon.svg'
    })
  }
}

watch(() => movieDetails.value, (newMovie) => {
  if (newMovie) {
    updateMovieSeo(newMovie)
  }
}, { immediate: true })
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.netflix-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.netflix-loader-bar {
  width: 4px;
  height: 36px;
  background-color: #e50914;
  animation: netflix-loader 1s ease-in-out infinite;
}

.netflix-loader-bar:nth-child(1) {
  animation-delay: 0s;
}

.netflix-loader-bar:nth-child(2) {
  animation-delay: 0.2s;
}

.netflix-loader-bar:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes netflix-loader {
  0% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .netflix-loader-bar {
    width: 3px;
    height: 24px;
  }
}
</style> 