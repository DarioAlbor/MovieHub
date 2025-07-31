<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
    ]"
  >
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-8">
        <NuxtLink to="/movies" class="text-red-600 text-2xl font-bold">
          MOVIEHUB
        </NuxtLink>

        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/movies" class="text-white hover:text-gray-300 transition-colors">
            Inicio
          </NuxtLink>
          <NuxtLink to="/movies" class="text-white hover:text-gray-300 transition-colors">
            Películas
          </NuxtLink>
          <NuxtLink to="/movies" class="text-white hover:text-gray-300 transition-colors">
            Series
          </NuxtLink>
          <NuxtLink to="/movies" class="text-white hover:text-gray-300 transition-colors">
            Mi lista
          </NuxtLink>
          <NuxtLink to="/movies" class="text-white hover:text-gray-300 transition-colors">
            Explorar
          </NuxtLink>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <div v-if="showSearch" class="flex items-center">
            <input
              type="text"
              placeholder="Títulos, personas, géneros"
              class="bg-black border border-white text-white placeholder-gray-400 w-64 py-2 px-3 pr-10 rounded"
              ref="searchInput"
              @blur="handleSearchBlur"
            />
            <SearchIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button
            v-else
            @click="toggleSearch"
            class="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10"
          >
            <SearchIcon class="h-5 w-5" />
          </button>
        </div>

        <button class="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10">
          <BellIcon class="h-5 w-5" />
        </button>

        <div class="relative" ref="profileDropdown">
          <button 
            @click="toggleDropdown" 
            class="flex items-center space-x-2 text-white hover:text-gray-300"
          >
            <div class="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <UserIcon class="h-4 w-4" />
            </div>
            <ChevronDownIcon class="h-4 w-4" />
          </button>
          
          <div 
            v-if="isDropdownOpen" 
            class="absolute right-0 mt-2 w-48 bg-black border border-gray-800 text-white rounded shadow-lg py-1"
          >
            <a href="#" class="block px-4 py-2 hover:bg-gray-800">Administrar perfiles</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-800">Cuenta</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-800">Centro de ayuda</a>
            <a href="#" @click.prevent="logout" class="block px-4 py-2 hover:bg-gray-800">Cerrar sesión</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { SearchIcon, BellIcon, UserIcon, ChevronDownIcon } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const isScrolled = ref(false)
const showSearch = ref(false)
const isDropdownOpen = ref(false)
const searchInput = ref(null)
const profileDropdown = ref(null)
const { logout: authLogout } = useAuth()
const router = useRouter()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const toggleSearch = () => {
  showSearch.value = true
  setTimeout(() => {
    searchInput.value?.focus()
  }, 0)
}

const handleSearchBlur = () => {
  showSearch.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const logout = async () => {
  try {
    await authLogout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>
