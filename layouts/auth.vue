<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '~/composables/useSeo'

useSeo({
  title: 'Acceso a MovieHub - Tu plataforma de entretenimiento',
  description: 'Inicia sesión en MovieHub para acceder a una amplia selección de películas y series.',
  keywords: 'login, acceso, autenticación, películas, series, streaming, MovieHub',
  url: 'https://moviehub-verifarma.vercel.app/login'
})
</script>

<style scoped>
</style> 