import {
  useGqlPulseBatchRequests,
  type BatchRequestConfig,
  type BatchResult,
} from './useGqlPulseBatchRequests'
import { useAsyncData, useNuxtApp } from '#app'
import type { AsyncDataOptions } from 'nuxt/app'
import type { TVariables, TKeysOf } from '../../module'
import type { TClients } from '#build/types/gql-pulse.d.ts'

export const useAsyncGqlPulseBatch = <
  ResT extends BatchResult,
  NuxtErrorDataT = unknown,
  DataT = ResT,
  PickKeys extends TKeysOf<DataT> = TKeysOf<DataT>,
  DefaultT = DataT | null,
>(cxt: {
  key: string
  requests: BatchRequestConfig<TVariables>[]
  client?: TClients
  withPayloadCache?: boolean
  options?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>
}) => {
  const nuxtApp = useNuxtApp()

  const payloadCache = cxt.withPayloadCache
    ? {
        getCachedData: (key: string) =>
          nuxtApp.payload.data[key] || nuxtApp.static.data[key],
      }
    : null

  return useAsyncData<ResT, NuxtErrorDataT, DataT, PickKeys, DefaultT>(
    cxt.key,
    () => useGqlPulseBatchRequests<ResT, TVariables>({
      client: cxt.client,
      documents: cxt.requests,
    }),
    { ...cxt.options, ...payloadCache },
  )
}
