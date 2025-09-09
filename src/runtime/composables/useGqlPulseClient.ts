import type { TClients } from '#build/types/gql-pulse.d.ts'
import type { GraphQLClient } from 'graphql-request'
import { useNuxtApp } from '#app'

export const useGqlPulseClient = (client: TClients) => {
  return (useNuxtApp().$gqlPulse as Record<TClients, GraphQLClient>)[
    client
  ] as GraphQLClient
}
