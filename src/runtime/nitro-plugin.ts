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

  const clientConfigs = Object.entries(definedClients).map(
    ([clientName, clientConfig]) => ({
      name: clientName as keyof typeof definedClients,
      endpoint: clientConfig.endpoint,
      options: {
        ...commonOptions,
        ...clientConfig.options,
      },
    }),
  )

  nitroApp.hooks.hook('request', (event) => {
    const graphClients = clientConfigs.reduce((acc, cfg) => {
      acc[cfg.name] = new GraphQLClient(cfg.endpoint, cfg.options)
      return acc
    }, {} as Record<keyof typeof definedClients, GraphQLClient>)

    event.context.$gqlPulse = graphClients
  })
})
