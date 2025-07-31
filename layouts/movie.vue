<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '~/composables/useSeo'
import { useRoute } from 'vue-router'

const route = useRoute()
const movieId = route.params.id

if (movieId) {
  useSeo({
    title: `Película ${movieId} - MovieHub`,
    description: `Detalles de la película ${movieId} en MovieHub, tu plataforma de streaming favorita.`,
    keywords: 'película, detalle, streaming, MovieHub',
    url: `https://moviehub-verifarma.vercel.app/movies/${movieId}`
  })
} else {
  useSeo({
    title: 'Explorar películas - MovieHub',
    description: 'Explora nuestra colección de películas y series en MovieHub.',
    keywords: 'películas, series, catálogo, streaming, MovieHub',
    url: 'https://moviehub-verifarma.vercel.app/movies'
  })
}
</script>

<style scoped>
</style> 