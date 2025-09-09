import type { DocumentNode } from 'graphql'
import type { GraphQLClient } from 'graphql-request'
import type { TVariables } from '../../module'
import type { TClients } from '#build/types/gql-pulse.d.ts'
import { useGqlPulseClient } from './useGqlPulseClient'

interface Result<Data extends object = object> {
  data: Data
}

type BatchResult = [Result, ...Result[]]

export const useGqlPulseBatchRequests = async <
  ResT extends BatchResult,
  V extends TVariables,
>(cxt: {
  documents: {
    document: string | DocumentNode
    variables?: V
  }[]
  client?: TClients
}) => {
  const gqlPulseClient = useGqlPulseClient(
    cxt.client === undefined ? 'default' : cxt.client,
  ) as GraphQLClient

  return await gqlPulseClient.batchRequests<ResT, TVariables>(cxt.documents)
}
