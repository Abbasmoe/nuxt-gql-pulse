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

export type TRequestConfig = Omit<
  GraphQLClient['requestConfig'],
  | 'requestMiddleware'
  | 'responseMiddleware'
  | 'jsonSerializer'
  | 'signal'
  | 'body'
  | 'window'
>

export type ClientConfig = {
  endpoint: string
  options?: TRequestConfig
}

type TModuleComposables = | 'useGqlPulseRequest'
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

    // Merge module options
    nuxt.options.runtimeConfig.gqlPulse = defu(
      nuxt.options.runtimeConfig.gqlPulse || {},
      { clients: moduleOptions.clients, options: moduleOptions.options || {} },
    )

    nuxt.options.runtimeConfig.public.gqlPulse = defu(
      nuxt.options.runtimeConfig.public.gqlPulse || {},
      { clients: moduleOptions.clients, options: moduleOptions.options || {} },
    )

    const clientKeyUnion = Object.keys(moduleOptions.clients).map(key => `'${key}'`).join(' | ') || 'never'

    // Provide the plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Add types
    addTypeTemplate({
      filename: 'types/gql-pulse.d.ts',
      getContents: () => {
        return `
          import type { GraphQLClient } from 'graphql-request'
          import type { DocumentNode } from 'graphql'

          declare global {
            type TGqlPulseClientKey = ${clientKeyUnion};
            type TGqlPulseClients = Record<TGqlPulseClientKey, GraphQLClient>
          }

          declare module '#app' {
            interface NuxtApp {
                $gqlPulse: TGqlPulseClients
            }

            declare module 'vue' {
                interface ComponentCustomProperties {
                  $gqlPulse: TGqlPulseClients
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
