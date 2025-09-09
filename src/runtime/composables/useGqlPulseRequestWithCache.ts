import type { DocumentNode } from 'graphql'
import type { TVariables } from '../../module'
import type { TClients } from '#build/types/gql-pulse.d.ts'
import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { useGqlPulseRequest } from './useGqlPulseRequest'

type TGqlPulseRequestWithSessionCacheOptions = {
  key: string
  document: string | DocumentNode
  client?: TClients
  variables?: TVariables
}

export const useGqlPulseRequestWithCache = async <ResT>({
  key,
  document,
  client,
  variables,
}: TGqlPulseRequestWithSessionCacheOptions) => {
  // Use sessionStorage to cache data
  const cached = useSessionStorage<ResT>(key, null, {
    serializer: StorageSerializers.object,
  })

  if (!cached.value) {
    const data = await useGqlPulseRequest<ResT>({
      client,
      document,
      variables,
    })

    // Update the cache
    cached.value = data
  }

  return cached
}
