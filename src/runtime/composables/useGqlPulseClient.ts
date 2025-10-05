import type { GraphQLClient } from 'graphql-request'
import { useNuxtApp } from '#app'

type TDefaultGqlPulseClientKey = 'default' | TGqlPulseClientKey

export const useGqlPulseClient = (
  client: TDefaultGqlPulseClientKey = 'default',
) => {
  return (
    useNuxtApp().$gqlPulse as Record<TDefaultGqlPulseClientKey, GraphQLClient>
  )[client]
}
