import type { DocumentNode } from 'graphql'
import type { TVariables } from '../../module'
import type { TClients } from '#build/types/gql-pulse.d.ts'
import { useGqlPulseClient } from './useGqlPulseClient'

export const useGqlPulseRequest = async <ResT>(cxt: {
  document: string | DocumentNode
  client?: TClients
  variables?: TVariables
}) => {
  const gqlPulseClient = useGqlPulseClient(
    cxt.client === undefined ? 'default' : cxt.client,
  )

  return await gqlPulseClient.request<ResT, TVariables>(
    cxt.document,
    cxt.variables,
  )
}
