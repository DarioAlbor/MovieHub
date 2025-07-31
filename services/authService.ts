import { useFetch, useRuntimeConfig } from 'nuxt/app'

interface LoginCredentials {
  email: string
  password: string
}

interface User {
  id: number
  name: string
  email: string
}

interface LoginResponse {
  user: User
  token: string
  message: string
}

interface ApiResponse {
  status: number
  body: {
    user?: User
    token?: string
    message?: string
  }
}

export const useAuthService = () => {
  const config = useRuntimeConfig()
  
  const storageKey = config.public.authTokenName || 'auth_token'
  
  if (!storageKey) {
    throw new Error('verificar las variables de entorno')
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await useFetch<ApiResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (error.value) {
        throw new Error(error.value.message || 'Error en el inicio de sesión')
      }

      if (data.value?.status === 401 || data.value?.status === 400) {
        throw new Error(data.value.body.message || 'Credenciales inválidas')
      }

      if (data.value?.status === 200 && data.value.body.token) {
        localStorage.setItem(storageKey, data.value.body.token as string)
        return {
          user: data.value.body.user,
          token: data.value.body.token,
          message: data.value.body.message
        }
      }
      
      return null
    } catch (err) {
      throw err
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(storageKey)
      
      if (!token) {
        return null
      }

      const { data, error } = await useFetch<ApiResponse>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (error.value) {
        throw new Error(error.value.message || 'Error al verificar autenticación')
      }

      if (data.value?.status !== 200) {
        throw new Error(data.value?.body.message || 'Error al verificar autenticación')
      }

      return data.value
    } catch (err) {
      return null
    }
  }

  const logout = async () => {
    try {
      await useFetch('/api/auth/logout', {
        method: 'POST'
      })
      
      localStorage.removeItem(storageKey)
      return true
    } catch (err) {
      localStorage.removeItem(storageKey)
      return true
    }
  }

  return {
    login,
    checkAuth,
    logout
  }
} 