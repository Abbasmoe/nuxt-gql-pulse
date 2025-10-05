import type { DocumentNode } from 'graphql'
import type { TVariables } from '../../module'
import { useGqlPulseClient } from './useGqlPulseClient'

interface Result<Data extends object = object> {
  data: Data
}

export type GraphQLClientRequestHeaders = | Headers
  | string[][]
  | Record<string, string>

export type BatchResult = [Result, ...Result[]]

export interface BatchRequestConfig<V> {
  document: string | DocumentNode
  variables?: V
  requestHeaders?: GraphQLClientRequestHeaders
  signal?: AbortSignal
}

export const useGqlPulseBatchRequests = async <
  ResT extends BatchResult,
  V extends TVariables,
>(cxt: {
  documents: BatchRequestConfig<V>[]
  client?: TGqlPulseClientKey
}) => {
  const gqlPulseClient = useGqlPulseClient(cxt.client)

  return await gqlPulseClient.batchRequests<ResT, TVariables>(cxt.documents)
}
