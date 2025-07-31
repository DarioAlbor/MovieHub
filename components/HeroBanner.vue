<template>
  <div class="relative h-[50vh] md:h-[70vh] overflow-hidden">
    <div v-if="isLoading" class="absolute inset-0 z-20 flex justify-center items-center bg-black">
      <div class="netflix-loader">
        <div class="netflix-loader-bar"></div>
        <div class="netflix-loader-bar"></div>
        <div class="netflix-loader-bar"></div>
      </div>
    </div>

    <div class="absolute inset-0">
      <img
        :src="featuredMovie.backdrop !== 'N/A' ? featuredMovie.backdrop : 'https://via.placeholder.com/1400x800?text=No+Image'"
        :alt="featuredMovie.title"
        class="w-full h-full object-cover object-center"
        loading="eager"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-black opacity-30"></div>
    </div>

    <div class="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-12">
      <div class="max-w-2xl space-y-3 md:space-y-6">
        <h1 class="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{{ featuredMovie.title }}</h1>
        
        <div v-if="featuredMovie.rating" class="flex items-center space-x-2">
          <div class="bg-yellow-500 text-black font-bold px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
            {{ featuredMovie.rating }}/10
          </div>
          <span class="text-gray-300 text-xs md:text-sm">IMDb Rating</span>
        </div>

        <p class="text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-shadow max-w-xl line-clamp-3">
          {{ featuredMovie.description }}
        </p>

        <div class="flex items-center space-x-2 md:space-x-4">
          <NuxtLink 
            :to="featuredMovie.id ? `/movies/${featuredMovie.id}` : '#'" 
            class="bg-white text-black hover:bg-gray-200 font-bold px-3 md:px-8 py-2 md:py-3 text-sm md:text-lg flex items-center space-x-1 md:space-x-2 rounded"
          >
            <PlayIcon class="h-4 w-4 md:h-5 md:w-5 fill-current" />
            <span>Reproducir</span>
          </NuxtLink>

          <NuxtLink 
            :to="featuredMovie.id ? `/movies/${featuredMovie.id}` : '#'" 
            class="bg-gray-600 bg-opacity-70 text-white hover:bg-gray-500 font-bold px-3 md:px-8 py-2 md:py-3 text-sm md:text-lg flex items-center space-x-1 md:space-x-2 rounded"
          >
            <InfoIcon class="h-4 w-4 md:h-5 md:w-5" />
            <span class="hidden sm:inline">Más información</span>
            <span class="inline sm:hidden">Info</span>
          </NuxtLink>
        </div>
      </div>

      <div class="absolute bottom-4 right-4 md:bottom-6 md:right-6">
        <button
          @click="toggleMute"
          class="bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full p-2 md:p-3"
        >
          <VolumeXIcon v-if="isMuted" class="h-4 w-4 md:h-5 md:w-5" />
          <Volume2Icon v-else class="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Play as PlayIcon, 
  Info as InfoIcon, 
  Volume2 as Volume2Icon, 
  VolumeX as VolumeXIcon 
} from 'lucide-vue-next'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const isMuted = ref(true)
const featuredMovie = ref(props.movie)
const isLoading = ref(true)

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const handleImageLoad = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const handleImageError = () => {
  isLoading.value = false
}

watch(() => props.movie, (newMovie) => {
  if (newMovie) {
    featuredMovie.value = newMovie
    isLoading.value = true
  }
}, { deep: true })

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
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
</style>
