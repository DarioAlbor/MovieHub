import { defineEventHandler, getHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event)
    const authHeader = headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        body: {
          message: 'No autorizado'
        }
      }
    }
    
    return {
      status: 200,
      body: {
        user: {
          id: 1,
          name: 'Usuario de Prueba',
          email: 'usuario@ejemplo.com'
        }
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