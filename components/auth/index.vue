<template>
  <div class="bg-black bg-opacity-75 p-4 sm:p-6 md:p-8 rounded-lg backdrop-blur-sm border border-gray-800">
    <div class="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-white">Iniciar Sesión</h2>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
      <p>{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
      <div class="space-y-1 sm:space-y-2">
        <label for="email" class="text-xs sm:text-sm font-medium text-gray-300 block">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          v-model="email"
          class="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-600 focus:ring-red-600 h-10 sm:h-12 md:h-14 text-sm sm:text-base px-3 sm:px-4 rounded-md"
          placeholder="Ingresa tu correo electrónico"
          required
        />
      </div>

      <div class="space-y-1 sm:space-y-2">
        <label for="password" class="text-xs sm:text-sm font-medium text-gray-300 block">
          Contraseña
        </label>
        <div class="relative">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            class="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-600 focus:ring-red-600 h-10 sm:h-12 md:h-14 text-sm sm:text-base px-3 sm:px-4 pr-10 sm:pr-12 rounded-md"
            placeholder="Ingresa tu contraseña"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
          >
            <EyeIcon v-if="!showPassword" class="h-4 w-4 sm:h-5 sm:w-5" />
            <EyeOffIcon v-else class="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      <!-- Botón de auto-completar credenciales -->
      <button
        type="button"
        @click="fillDemoCredentials('admin@moviehub.com', 'admin123')"
        class="w-full bg-transparent border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors duration-200 h-10 sm:h-12 rounded flex items-center justify-center space-x-2"
      >
        <ZapIcon class="h-4 w-4" />
        <span>Auto-completar credenciales de demo</span>
      </button>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 md:py-4 px-4 rounded text-sm sm:text-base md:text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 h-10 sm:h-12 md:h-14"
      >
        {{ isLoading ? "Iniciando sesión..." : "Iniciar Sesión" }}
      </button>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            v-model="rememberMe"
            class="rounded border-gray-600 text-red-600 focus:ring-red-600"
          />
          <label for="remember" class="text-xs sm:text-sm text-gray-300 cursor-pointer">
            Recuérdame
          </label>
        </div>
        <a href="#" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
          ¿Necesitas ayuda?
        </a>
      </div>
    </form>

    <div class="mt-6 sm:mt-8 text-center">
      <p class="text-gray-400 text-xs sm:text-sm">
        ¿Primera vez en MovieHub?
        <a href="#" class="text-white hover:underline">
          Suscríbete ahora
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon, Zap as ZapIcon } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

// Estado del formulario
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const { login, error } = useAuth()
const router = useRouter()

// Método para autocompletar las credenciales (usado desde la página de login)
const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
  email.value = demoEmail
  password.value = demoPassword
}

// Exponer el método para que pueda ser llamado desde el componente padre
defineExpose({
  fillDemoCredentials
})

// Manejar envío del formulario
const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Usar el servicio de autenticación que creamos anteriormente
    const response = await login(email.value, password.value)
    
    if (response) {
      // Redirigir a la página principal
      router.push('/movies')
    } else {
      // Si no hay respuesta, mostrar un mensaje de error
      errorMessage.value = 'Credenciales inválidas. Por favor, intenta de nuevo.'
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err)
    errorMessage.value = error.value || 'Error al iniciar sesión. Por favor, intenta de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
@media (max-width: 640px) {
  input, button[type="submit"] {
    font-size: 14px;
  }
}
</style>
