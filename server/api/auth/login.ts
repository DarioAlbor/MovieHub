import { defineEventHandler, readBody } from 'h3'

// credenciales de prueb
const validUsers = [
  {
    email: 'admin@moviehub.com',
    password: 'admin123',
    name: 'Administrador',
    id: 1
  }
]

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    
    if (!email || !password) {
      return {
        status: 400,
        body: {
          message: 'Email y contraseña son requeridos'
        }
      }
    }
    
    const user = validUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return {
        status: 401,
        body: {
          message: 'Credenciales inválidas'
        }
      }
    }
    
    const { password: _, ...userWithoutPassword } = user
    
    const token = `auth-token-${Math.random().toString(36).substring(2, 15)}`
    
    return {
      status: 200,
      body: {
        user: userWithoutPassword,
        token,
        message: 'Inicio de sesión exitoso'
      }
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        message: 'Error interno del servidor'
      }
    }
  }
})