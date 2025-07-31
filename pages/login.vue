<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- fondo dinamico -->
    <div class="absolute inset-0 z-0 bg-black">
      <div class="movie-grid">
        <div 
          v-for="(poster, index) in posterGrid" 
          :key="`poster-${index}-${poster.key}`" 
          class="movie-poster"
        >
          <img 
            :src="poster.url" 
            :alt="`Movie poster ${index}`"
            class="w-full h-full object-cover"
            :style="{
              opacity: poster.opacity,
              transform: `scale(${poster.scale})`,
              transition: 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out'
            }"
            @error="handleImageError(index)"
            loading="lazy"
          />
        </div>
      </div>
      
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
    </div>

    <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-10"></div>

    <div class="relative z-20 w-full max-w-6xl px-4 sm:px-6">
      <div class="text-center mb-6 sm:mb-12">
        <div class="flex items-center justify-center">
          <PlayIcon class="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-600 mr-2 sm:mr-3" />
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 mb-1 sm:mb-2">MOVIEHUB</h1>
        </div>
        <p class="text-gray-300 text-sm sm:text-base md:text-lg">Tu plataforma de entretenimiento</p>
      </div>

      <!-- dos columnas para las credenciales y el form de login -->
      <div class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12">

        <div class="w-full lg:w-auto flex-shrink-0">
          <CredentialsCard />
        </div>

        <div class="w-full max-w-md flex-shrink-0">
          <AuthIndex />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMovieService } from '~/services/movieService'
import { Play as PlayIcon } from 'lucide-vue-next'
import AuthIndex from '~/components/auth/index.vue'
import CredentialsCard from '~/components/auth/CredentialsCard.vue'

// layout dinamico para mejorar la legibilidad del seo
definePageMeta({
  layout: 'auth'
})

interface MoviePoster {
  url: string;
  opacity: number;
  scale: number;
  key: number;
}

// estos estados son para el fondo dinamico
const movieService = useMovieService()
const movieBackdrops = ref<any[]>([])
const posterGrid = ref<MoviePoster[]>([])
const gridSize = ref(24)
const posterRotationTimer = ref<number | null>(null)
const invalidImageUrls = ref<Set<string>>(new Set()) // como la api no siempre carga las imagenes guardo las que fallaron para no repetirlas

// para hacerlo más responsive se ajusta el numero de posters segun el tamaño de la pantalla
const adjustPosterGrid = () => {
  if (process.client) {
    const width = window.innerWidth
    if (width < 640) {
      gridSize.value = 12 // mobile
    } else if (width < 1024) {
      gridSize.value = 16 // tablets
    } else {
      gridSize.value = 24 // desktop
    }
    
    if (movieBackdrops.value.length > 0) {
      initializePosters()
    }
  }
}

const loadBackdropMovies = async () => {
  try {
    // categorias varias
    const responses = await Promise.all([
      movieService.searchMovies('popular'),
      movieService.searchMovies('2023'),
      movieService.searchMovies('action'),
      movieService.searchMovies('drama'),
      movieService.searchMovies('marvel'),
      movieService.searchMovies('star wars')
    ])
    
    let movies: any[] = []
    
    responses.forEach(response => {
      if (response.Response === 'True') {
        movies = [...movies, ...response.Search]
      }
    })
    
    // solo las que tienen poster
    movieBackdrops.value = movies
      .filter(movie => movie.Poster && movie.Poster !== 'N/A')
      // para evitar duplicados
      .filter((movie, index, self) => 
        index === self.findIndex((m) => m.imdbID === movie.imdbID)
      )
    
    initializePosters()
    
    // tiempo para cambiar posters
    startPosterUpdateInterval()
  } catch (error) {
    // en caso de error se usan posters por defecto
    initializeDefaultPosters()
  }
}

const initializePosters = () => {
  if (movieBackdrops.value.length === 0) {
    initializeDefaultPosters()
    return
  }
  
  posterGrid.value = Array(gridSize.value).fill(null).map((_, index) => {
    const movieIndex = index % movieBackdrops.value.length
    return {
      url: movieBackdrops.value[movieIndex].Poster,
      opacity: 1,
      scale: 1,
      key: Date.now() + index
    }
  })
}

// en caso de error se usan posters por defecto (se que lo mejor era tomarlo de la api pero los tomo estaticos porque la mayoria no tienen poster)
const initializeDefaultPosters = () => {
  const defaultUrls = [
    'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BNDUyODAzNDI1Nl5BMl5BanBnXkFtZTcwMDA2NDAzMw@@._V1_SX300.jpg'
  ]
  
  posterGrid.value = Array(gridSize.value).fill(null).map((_, index) => {
    const urlIndex = index % defaultUrls.length
    return {
      url: defaultUrls[urlIndex],
      opacity: 1,
      scale: 1,
      key: Date.now() + index
    }
  })
}

// para evitar que se repitan las imagenes que fallaron al cargar
const handleImageError = (index: number) => {
  invalidImageUrls.value.add(posterGrid.value[index].url)
  replaceFailedImage(index)
}

const replaceFailedImage = (index: number) => {
  const validMovies = movieBackdrops.value.filter(movie => 
    !invalidImageUrls.value.has(movie.Poster)
  )
  
  if (validMovies.length > 0) {
    const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)]
    
    posterGrid.value[index] = {
      ...posterGrid.value[index],
      url: randomMovie.Poster,
      key: Date.now()
    }
  } else {
    // lo mismo que arriba pero con otras imagenes
    const fallbackUrls = [
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjA0ODEzMTc1Nl5BMl5BanBnXkFtZTcwMTE0OTc4OQ@@._V1_SX300.jpg',
      'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
    ]
    
    posterGrid.value[index] = {
      ...posterGrid.value[index],
      url: fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)],
      key: Date.now()
    }
  }
}

const updateRandomPoster = () => {
  if (movieBackdrops.value.length === 0) return
  
  const randomIndex = Math.floor(Math.random() * posterGrid.value.length)
  
  const validMovies = movieBackdrops.value.filter(movie => 
    !invalidImageUrls.value.has(movie.Poster)
  )
  
  if (validMovies.length === 0) return
  
  const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)]
  
  posterGrid.value[randomIndex].opacity = 0
  posterGrid.value[randomIndex].scale = 1.1
  
  setTimeout(() => {
    posterGrid.value[randomIndex] = {
      ...posterGrid.value[randomIndex],
      url: randomMovie.Poster,
      key: Date.now()
    }
    
    setTimeout(() => {
      posterGrid.value[randomIndex].opacity = 1
      posterGrid.value[randomIndex].scale = 1
    }, 100)
  }, 1500)
}

// tiempo para cambiar posters
const startPosterUpdateInterval = () => {
  posterRotationTimer.value = window.setInterval(() => {
    updateRandomPoster()
  }, 1500)
}

onBeforeUnmount(() => {
  if (posterRotationTimer.value !== null) {
    clearInterval(posterRotationTimer.value)
  }
  
  // para que se actualice el tamaño de la cuadrícula
  if (process.client) {
    window.removeEventListener('resize', adjustPosterGrid)
  }
})

onMounted(() => {
  adjustPosterGrid()
  
  if (process.client) {
    window.addEventListener('resize', adjustPosterGrid)
  }
  
  loadBackdropMovies()
})
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  gap: 2px;
}

@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 3px;
  }
}

@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 4px;
  }
}

.movie-poster {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.movie-poster img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style> 