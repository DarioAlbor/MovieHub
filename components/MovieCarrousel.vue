<template>
  <div class="relative group px-2 sm:px-4 md:px-6 lg:px-12">
    <h2 class="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4">{{ title }}</h2>

    <div class="relative flex items-center">
      <button
        class="flex-shrink-0 mr-1 sm:mr-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        @click="scroll('left')"
      >
        <ChevronLeftIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </button>

      <div 
        ref="scrollRef" 
        class="flex-grow flex space-x-1 sm:space-x-2 overflow-x-auto carousel-container pb-4"
      >
        <div
          v-for="(movie, index) in filteredMovies"
          :key="movie.id"
          class="relative flex-shrink-0 w-28 sm:w-36 md:w-48 lg:w-64"
          @mouseenter="setHoveredMovie(movie.id)"
          @mouseleave="setHoveredMovie(null)"
        >
          <div 
            class="relative movie-card-hover cursor-pointer"
            @mousedown="handleMouseDown($event, movie.id)"
            @mouseup="handleMouseUp($event, movie.id)"
            @touchstart="handleTouchStart($event, movie.id)"
            @touchend="handleTouchEnd($event, movie.id)"
            @click="handleClick($event, movie.id)"
          >
            <div class="h-40 sm:h-52 md:h-64 lg:h-72 overflow-hidden rounded-md">
              <img
                :src="movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x400?text=No+Image'"
                :alt="movie.title"
                class="w-full h-full object-cover"
                @error="handleImageError(index)"
                loading="lazy"
              />
            </div>

            <div v-if="showProgress && movie.progress" class="absolute bottom-0 left-0 right-0 bg-gray-800 h-1">
              <div class="bg-red-600 h-full" :style="{ width: `${movie.progress}%` }"></div>
            </div>

            <div
              v-if="hoveredMovie === movie.id"
              class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-md"
            >
              <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                <h3 class="text-white font-bold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">{{ movie.title }}</h3>
                <p v-if="movie.year" class="text-gray-300 text-xs mb-1 sm:mb-2">{{ movie.year }}</p>
                <div class="flex items-center space-x-1 sm:space-x-2">
                  <button 
                    class="bg-white text-black hover:bg-gray-200 rounded-full p-1"
                    @click.stop="navigateToMovie(movie.id)"
                  >
                    <PlayIcon class="h-2 w-2 sm:h-3 sm:w-3 fill-current" />
                  </button>
                  <button class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1">
                    <PlusIcon class="h-2 w-2 sm:h-3 sm:w-3" />
                  </button>
                  <button class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1">
                    <ThumbsUpIcon class="h-2 w-2 sm:h-3 sm:w-3" />
                  </button>
                  <button class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 ml-auto">
                    <ChevronDownIcon class="h-2 w-2 sm:h-3 sm:w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        class="flex-shrink-0 ml-1 sm:ml-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        @click="scroll('right')"
      >
        <ChevronRightIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, 
  Play as PlayIcon, 
  Plus as PlusIcon, 
  ThumbsUp as ThumbsUpIcon, 
  ChevronDown as ChevronDownIcon 
} from 'lucide-vue-next'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  movies: {
    type: Array,
    required: true
  },
  showProgress: {
    type: Boolean,
    default: false
  }
})

const hoveredMovie = ref(null)
const scrollRef = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const failedImageIndexes = ref(new Set())
const clickStartTime = ref(0)
const clickStartPosition = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const selectedMovieId = ref(null)

const filteredMovies = computed(() => {
  return props.movies.filter((_, index) => !failedImageIndexes.value.has(index))
})

const setHoveredMovie = (id) => {
  if (window.innerWidth < 640) return
  hoveredMovie.value = id
}

const scroll = (direction) => {
  if (scrollRef.value) {
    const scrollAmount = window.innerWidth < 640 ? 150 : 300
    scrollRef.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}

const navigateToMovie = (id) => {
  if (id) {
    router.push(`/movies/${id}`)
  }
}

const handleImageError = (index) => {
  failedImageIndexes.value.add(index)
}

const handleMouseDown = (e, movieId) => {
  if (!scrollRef.value) return
  
  clickStartTime.value = Date.now()
  clickStartPosition.value = { x: e.clientX, y: e.clientY }
  selectedMovieId.value = movieId
  hasMoved.value = false
  
  startDrag(e)
}

const handleTouchStart = (e, movieId) => {
  if (!scrollRef.value) return
  
  clickStartTime.value = Date.now()
  clickStartPosition.value = { 
    x: e.touches[0].clientX, 
    y: e.touches[0].clientY 
  }
  selectedMovieId.value = movieId
  hasMoved.value = false
  
  startDrag(e)
}

const handleMouseUp = (e) => {
  const clickDuration = Date.now() - clickStartTime.value
  const deltaX = Math.abs(e.clientX - clickStartPosition.value.x)
  const deltaY = Math.abs(e.clientY - clickStartPosition.value.y)
  
  if (clickDuration < 300 && deltaX < 10 && deltaY < 10) {
    hasMoved.value = false
  }
  
  stopDrag()
}

const handleTouchEnd = (e) => {
  const clickDuration = Date.now() - clickStartTime.value
  
  if (clickDuration < 300) {
    hasMoved.value = false
  }
  
  stopDrag()
}

const handleClick = (e, movieId) => {
  if (!hasMoved.value) {
    navigateToMovie(movieId)
  }
}

const startDrag = (e) => {
  if (!scrollRef.value) return
  
  isDragging.value = true
  
  startX.value = e.type.includes('touch')
    ? e.touches[0].clientX - scrollRef.value.offsetLeft 
    : e.clientX - scrollRef.value.offsetLeft
    
  scrollLeft.value = scrollRef.value.scrollLeft
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value || !scrollRef.value) return
  
  e.preventDefault()
  
  const x = e.type.includes('touch')
    ? e.touches[0].clientX - scrollRef.value.offsetLeft 
    : e.clientX - scrollRef.value.offsetLeft
  
  const deltaX = Math.abs(x - startX.value)
  if (deltaX > 5) {
    hasMoved.value = true
  }
    
  const walk = (x - startX.value) * 2
  
  scrollRef.value.scrollLeft = scrollLeft.value - walk
}

const stopDrag = () => {
  isDragging.value = false
  
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<style scoped>
.carousel-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
  user-select: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-card-hover {
  cursor: pointer;
}

.movie-card-hover:active {
  cursor: grabbing;
}

@media (hover: none) {
  .group:hover button {
    opacity: 1;
  }
}
</style>
