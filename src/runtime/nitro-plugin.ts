import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { GraphQLClient } from 'graphql-request'
import type { ModuleOptions, TRequestConfig } from '../module'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const gqlPulse = config.public.gqlPulse as
    | { clients: ModuleOptions['clients'], options?: TRequestConfig }
    | undefined

  const commonOptions = gqlPulse?.options ?? {}
  const definedClients = gqlPulse?.clients ?? {}

  const graphClients = Object.entries(definedClients).reduce(
    (acc, [clientName, clientConfig]) => {
      acc[clientName as keyof typeof definedClients] = new GraphQLClient(
        clientConfig.endpoint,
        {
          ...commonOptions,
          ...clientConfig.options,
        },
      )
      return acc
    },
    {} as Record<keyof typeof definedClients, GraphQLClient>,
  )

  nitroApp.hooks.hook('request', (event) => {
    event.context.$gqlPulse = graphClients
  })
})
