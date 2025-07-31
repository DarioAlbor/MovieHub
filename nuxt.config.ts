// https://nuxt.com/docs/api/configuration/nuxt-config
import * as dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.NUXT_OMDB_API_KEY || ''
const API_URL = process.env.NUXT_OMDB_API_URL || ''
const TOKEN_NAME = process.env.NUXT_AUTH_TOKEN_NAME || ''
const APP_URL = process.env.NUXT_APP_URL || ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    // '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss'
  ],
  
  typescript: {
    strict: true,
    typeCheck: false
  },
  
  vite: {
    optimizeDeps: {
      exclude: ['fsevents']
    },
    define: {
      'process.env.NUXT_OMDB_API_KEY': JSON.stringify(API_KEY),
      'process.env.NUXT_OMDB_API_URL': JSON.stringify(API_URL),
      'process.env.NUXT_AUTH_TOKEN_NAME': JSON.stringify(TOKEN_NAME),
      'process.env.NUXT_APP_URL': JSON.stringify(APP_URL)
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      omdbApiKey: API_KEY,
      omdbApiUrl: API_URL,
      authTokenName: TOKEN_NAME,
      appUrl: APP_URL
    }
  }
})