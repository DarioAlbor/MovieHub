<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="netflix-loader">
      <div class="netflix-loader-bar"></div>
      <div class="netflix-loader-bar"></div>
      <div class="netflix-loader-bar"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'default'
})

const router = useRouter()

onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      router.push('/movies')
    } else {
      router.push('/login')
    }
  }
})
</script>

<style scoped>
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