import type { DocumentNode } from 'graphql'
import type { TVariables } from '../../module'
import { useGqlPulseClient } from './useGqlPulseClient'

export const useGqlPulseRequest = async <ResT>(cxt: {
  document: string | DocumentNode
  client?: TGqlPulseClientKey
  variables?: TVariables
}) => {
  const gqlPulseClient = useGqlPulseClient(cxt.client)

  return await gqlPulseClient.request<ResT, TVariables>(
    cxt.document,
    cxt.variables,
  )
}
