import { defineNuxtPlugin } from '#app'
import { GraphQLClient } from 'graphql-request'
import type { ModuleOptions, TRequestConfig } from '../module'

export default defineNuxtPlugin((nuxtApp) => {
  const commonOptions = nuxtApp.$config.public.gqlPulse
    ?.options as TRequestConfig
  const definedClients
    = (nuxtApp.$config.public.gqlPulse?.clients as ModuleOptions['clients'])
      ?? {}

  const graphClients = Object.entries(definedClients).reduce(
    (acc, [clientName, clientConfig]) => {
      acc[clientName] = new GraphQLClient(clientConfig.endpoint, {
        ...commonOptions,
        ...clientConfig.options,
      })

      return acc
    },
    {} as Record<keyof typeof definedClients, GraphQLClient>,
  )

  nuxtApp.$gqlPulse = graphClients
})
