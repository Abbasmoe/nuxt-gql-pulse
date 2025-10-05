import type { DocumentNode, OperationDefinitionNode } from 'graphql'
import type { AsyncDataOptions, AsyncData } from 'nuxt/app'
import type { TVariables, TKeysOf } from '../../module'
import { useGqlPulseRequest } from './useGqlPulseRequest'
import { useAsyncData, useNuxtApp } from '#app'

export const useAsyncGqlPulse = <
  ResT,
  NuxtErrorDataT = unknown,
  DataT extends ResT = ResT,
  PickKeys extends TKeysOf<DataT> = TKeysOf<DataT>,
  DefaultT = DataT | null,
>(cxt: {
  key?: string
  document: string | DocumentNode
  variables?: TVariables
  client?: TGqlPulseClientKey
  withPayloadCache?: boolean
  options?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>
}): AsyncData<ResT, NuxtErrorDataT> & AsyncData<ResT, Error> => {
  const nuxtApp = useNuxtApp()

  const payloadCache = cxt.withPayloadCache
    ? {
        getCachedData: (key: string) =>
          nuxtApp.payload.data[key] || nuxtApp.static.data[key],
      }
    : null

  const key = cxt.key || typeof cxt.document === 'string' ? cxt.document as string : `${(cxt.document.definitions[0] as OperationDefinitionNode)?.name?.value}`

  return useAsyncData<ResT, NuxtErrorDataT, DataT, PickKeys, DefaultT>(
    key,
    () =>
      useGqlPulseRequest<ResT>({
        client: cxt.client,
        document: cxt.document,
        variables: cxt.variables,
      }),

    { ...cxt.options, ...payloadCache },
  ) as AsyncData<ResT, NuxtErrorDataT> & AsyncData<ResT, Error>
}
