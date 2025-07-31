<template>
  <div class="min-h-screen bg-black">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Contenedor con altura fija para el Hero Banner -->
    <div class="h-[50vh] md:h-[70vh] relative">
      <!-- Hero Banner -->
      <HeroBanner v-if="featuredMovie" :movie="featuredMovie" />
      
      <!-- Loader de respaldo en caso de que el HeroBanner no esté listo -->
      <div v-else class="absolute inset-0 z-20 flex justify-center items-center bg-black">
        <div class="netflix-loader">
          <div class="netflix-loader-bar"></div>
          <div class="netflix-loader-bar"></div>
          <div class="netflix-loader-bar"></div>
        </div>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div class="relative z-10 mt-4 sm:mt-6 md:mt-8 space-y-6 sm:space-y-8 md:space-y-12 pb-12 md:pb-20 px-2 sm:px-4 md:px-6 lg:px-12">
      <!-- Carrusel de películas en tendencia -->
      <MovieCarrousel 
        v-if="trendingMovies.length > 0"
        title="Tendencias ahora" 
        :movies="trendingMovies" 
      />
      
      <!-- Carrusel de películas populares -->
      <MovieCarrousel 
        v-if="popularMovies.length > 0"
        title="Populares en MovieHub" 
        :movies="popularMovies" 
      />
      
      <!-- Carrusel de películas de acción -->
      <MovieCarrousel 
        v-if="actionMovies.length > 0"
        title="Películas de acción" 
        :movies="actionMovies" 
      />
      
      <!-- Carrusel de continuar viendo (simulado) -->
      <MovieCarrousel 
        v-if="continueWatchingMovies.length > 0"
        title="Continuar viendo" 
        :movies="continueWatchingMovies" 
        :showProgress="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useMovieService } from '~/services/movieService'
import Navbar from '~/components/ui/navbar.vue'
import HeroBanner from '~/components/HeroBanner.vue'
import MovieCarrousel from '~/components/MovieCarrousel.vue'

// Añadir la definición del layout al inicio del script setup
definePageMeta({
  middleware: ['auth'],
  layout: 'movie'
})

// Interfaces para tipar correctamente
interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  progress?: number;
}

interface FeaturedMovie {
  id: string;
  title: string;
  description: string;
  backdrop: string;
  rating: string;
}

// Estado local
const movieService = useMovieService()
const popularMovies = ref<Movie[]>([])
const trendingMovies = ref<Movie[]>([])
const actionMovies = ref<Movie[]>([])
const continueWatchingMovies = ref<Movie[]>([])
const featuredMovie = ref<FeaturedMovie | null>(null)
const loadingCarousels = ref(true)

// Convertir datos de la API al formato que espera el componente MovieCarrousel
const mapApiMoviesToCarouselFormat = (apiMovies: any[]): Movie[] => {
  return apiMovies.map(movie => ({
    id: movie.imdbID, // Aseguramos que el ID sea el imdbID para la navegación
    title: movie.Title,
    poster: movie.Poster,
    year: movie.Year
  }))
}

// Cargar datos para los carruseles
const loadCarouselData = async () => {
  try {
    loadingCarousels.value = true
    
    // Cargar películas populares (búsqueda por "marvel")
    const popularResponse = await movieService.searchMovies('marvel')
    if (popularResponse.Response === 'True') {
      popularMovies.value = mapApiMoviesToCarouselFormat(popularResponse.Search)
    }
    
    // Cargar películas en tendencia (búsqueda por año actual)
    const trendingResponse = await movieService.searchMovies('2023')
    if (trendingResponse.Response === 'True') {
      trendingMovies.value = mapApiMoviesToCarouselFormat(trendingResponse.Search)
    }
    
    // Cargar películas de acción
    const actionResponse = await movieService.searchMovies('action')
    if (actionResponse.Response === 'True') {
      actionMovies.value = mapApiMoviesToCarouselFormat(actionResponse.Search)
    }
    
    // Simular "Continuar viendo" con películas de Star Wars y añadir progreso
    const continueWatchingResponse = await movieService.searchMovies('star wars')
    if (continueWatchingResponse.Response === 'True') {
      // Añadir un valor de progreso aleatorio a cada película
      continueWatchingMovies.value = mapApiMoviesToCarouselFormat(continueWatchingResponse.Search)
        .map(movie => ({
          ...movie,
          progress: Math.floor(Math.random() * 90) + 10 // Progreso entre 10% y 99%
        }))
    }
    
    // Cargar película destacada (detalles de una película específica)
    if (popularResponse.Response === 'True' && popularResponse.Search.length > 0) {
      const featuredMovieId = popularResponse.Search[0].imdbID
      const featuredMovieDetails = await movieService.getMovieById(featuredMovieId)
      
      featuredMovie.value = {
        id: featuredMovieDetails.imdbID, // Aseguramos que el ID sea el imdbID para la navegación
        title: featuredMovieDetails.Title,
        description: featuredMovieDetails.Plot,
        backdrop: featuredMovieDetails.Poster,
        rating: featuredMovieDetails.imdbRating
      }
    }
  } catch (err) {
    console.error('Error al cargar datos para los carruseles:', err)
  } finally {
    loadingCarousels.value = false
  }
}

// Al montar el componente
onMounted(async () => {
  // Cargar datos para los carruseles
  await loadCarouselData()
})
</script>

<style scoped>
/* Animación de carga estilo Netflix */
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

/* Ajustes para dispositivos móviles */
@media (max-width: 640px) {
  .netflix-loader-bar {
    width: 3px;
    height: 24px;
  }
}
</style> 