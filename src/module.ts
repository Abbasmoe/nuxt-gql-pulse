import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addTypeTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'
import rollupGraphql from '@rollup/plugin-graphql'
import type { GraphQLClient } from 'graphql-request'

export type TKeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>

export type TVariables = Record<string, unknown>

export type TRequestConfig = GraphQLClient['requestConfig']

export type ClientConfig = {
  endpoint: string
  options?: TRequestConfig
}

type TModuleComposables =
  | 'useGqlPulseRequest'
  | 'useGqlPulseRequestWithCache'
  | 'useGqlPulseBatchRequests'
  | 'useGqlPulseRawRequest'
  | 'useAsyncGqlPulse'
  | 'useAsyncGqlPulseWithCache'
  | 'useAsyncGqlPulseBatch'

export interface ModuleOptions {
  clients: Record<string, ClientConfig>
  options?: TRequestConfig
  excludeComposables?: TModuleComposables[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gql-pulse',
    configKey: 'gqlPulse',
    compatibility: { nuxt: '^3.0.0 || ^4.0.0' },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    clients: {},
    options: {},
    excludeComposables: [],
  },
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Provide the plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Auto-import the main composable
    addImports({
      name: 'useGqlPulseClient',
      from: resolver.resolve('./runtime/composables/useGqlPulseClient'),
    })
    // Auto-import other composables or excludeComposables them
    const composables = [
      'useGqlPulseRequest',
      'useGqlPulseRequestWithCache',
      'useGqlPulseBatchRequests',
      'useGqlPulseRawRequest',
      'useAsyncGqlPulse',
      'useAsyncGqlPulseWithCache',
      'useAsyncGqlPulseBatch',
    ] as const

    for (const comp of composables) {
      if (moduleOptions.excludeComposables?.includes(comp)) {
        continue
      }
      addImports({
        name: comp,
        from: resolver.resolve(`./runtime/composables/${comp}`),
      })
    }

    // Extend Vite config (graphql loader)
    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps ||= {}
      config.optimizeDeps.include ||= []
      config.optimizeDeps.include.push('graphql-request')

      // Add GraphQL plugin to Vite
      config.plugins ||= []
      config.plugins.push(rollupGraphql())
    })

    // Merge runtime config with module options
    nuxt.options.runtimeConfig.public.gqlPulse = defu(
      nuxt.options.runtimeConfig.public.gqlPulse || {},
      { clients: moduleOptions.clients, options: moduleOptions.options || {} }
    )

    const typedClients = nuxt.options.runtimeConfig.public.gqlPulse
      .clients as ModuleOptions['clients']

    const clientKeys = Object.keys(typedClients)
      .map((key) => `'${key}'`)
      .join(' | ')

    // Add types
    addTypeTemplate({
      filename: 'types/gql-pulse.d.ts',
      getContents: () => {
        return `
          import type { GraphQLClient } from 'graphql-request'
          import type { DocumentNode } from 'graphql'

          export type TClients = ${clientKeys} | string

          declare module '#app' {
            interface NuxtApp {
                $gqlPulse: Record<TClients, GraphQLClient>
            }

            declare module 'vue' {
              interface ComponentCustomProperties {
                $gqlPulse: Record<TClients, GraphQLClient>
              }
            }

            declare module '*.gql' {
              const Schema: DocumentNode
              export default Schema
            }

            declare module '*.graphql' {
              const Schema: DocumentNode
              export default Schema
            }

            declare module '*.graphqls' {
              const Schema: DocumentNode
              export default Schema
              }
          }

          export {}
        `
      },
    })
  },
})
