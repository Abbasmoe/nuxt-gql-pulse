import type { GraphQLClient } from 'graphql-request'

export type TClients = 'rickandmortyapi'

declare module '#app' {
  interface NuxtApp {
    $gqlPulse: Record<TClients, GraphQLClient>
  }
}

export {}
