// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'system'
  },
  app: {
    baseURL: '/pdf-tools/'
  },
  server: {
    host: '0.0.0.0',
    port: 4000
  }
})
