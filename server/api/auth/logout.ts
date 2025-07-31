import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return {
    status: 200,
    body: {
      message: 'Sesión cerrada exitosamente'
    }
  }
})