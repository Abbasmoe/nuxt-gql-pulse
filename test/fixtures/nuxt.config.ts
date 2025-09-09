import MyModule from '../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  gqlPulse: {
    clients: {
      rickandmortyapi: { endpoint: 'https://rickandmortyapi.com/graphql' },
    },
  },
})
