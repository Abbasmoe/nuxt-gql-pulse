export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-08-31',
  gqlPulse: {
    clients: {
      rickandmortyapi: { endpoint: 'https://rickandmortyapi.com/graphql' },
    },
  },
})
