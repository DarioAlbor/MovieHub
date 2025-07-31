export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const authToken = localStorage.getItem('auth_token')
    
    if (!authToken && to.path !== '/login') {
      return navigateTo('/login')
    }
  }
}) 