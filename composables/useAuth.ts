import { ref } from 'vue'
import { useAuthService } from '~/services/authService'

interface User {
  id: number
  name: string
  email: string
}

interface AuthResponse {
  body?: {
    user?: User
    message?: string
  }
  status?: number
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const authService = useAuthService()
  
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login({ email, password })
      
      if (response) {
        user.value = response.user as User
        isAuthenticated.value = true
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    isLoading.value = true
    
    try {
      await authService.logout()
      user.value = null
      isAuthenticated.value = false
    } catch (err: any) {
      error.value = err.message || 'Error al cerrar sesión'
    } finally {
      isLoading.value = false
    }
  }
  
  const checkAuth = async () => {
    isLoading.value = true
    
    try {
      const response = await authService.checkAuth() as AuthResponse
      
      if (response?.body?.user) {
        user.value = response.body.user
        isAuthenticated.value = true
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch (err) {
      user.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }
  
  const initAuth = async () => {
    await checkAuth()
  }
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    initAuth
  }
} 