import type { AsyncDataOptions } from 'nuxt/app'
import type { DocumentNode } from 'graphql'
import type { TVariables, TKeysOf } from '../../module'
import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { useAsyncGqlPulse } from './useAsyncGqlPulse'

export type TPickFrom<T, K extends Array<string>>
  = T extends Array<unknown>
    ? T
    : T extends Record<string, unknown>
      ? keyof T extends K[number]
        ? T
        : K[number] extends never
          ? T
          : Pick<T, K[number]>
      : T

export const useAsyncGqlPulseWithCache = async <
  ResT,
  NuxtErrorDataT = unknown,
  DataT extends ResT = ResT,
  PickKeys extends TKeysOf<DataT> = TKeysOf<DataT>,
  DefaultT = DataT | null,
>(cxt: {
  key: string
  document: string | DocumentNode
  variables?: TVariables
  client?: TGqlPulseClientKey
  options?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>
}) => {
  // Use sessionStorage to cache data
  const cached = useSessionStorage<DefaultT | TPickFrom<DataT, PickKeys>>(
    cxt.key,
    null,
    {
      serializer: StorageSerializers.object,
    },
  )

  if (!cached.value) {
    const { data, error } = await useAsyncGqlPulse<
      ResT,
      NuxtErrorDataT,
      DataT,
      PickKeys,
      DefaultT
    >(cxt)

    if (error.value) {
      return Promise.reject({
        ...error.value,
        statusMessage: `Could not fetch data from ${cxt.key}`,
      })
    }

    // Update the cache
    cached.value = data.value as DefaultT | TPickFrom<DataT, PickKeys>
  }

  return cached
}
