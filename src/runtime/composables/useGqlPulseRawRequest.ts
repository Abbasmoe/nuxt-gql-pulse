import type { TVariables } from '../../module'
import type { TClients } from '#build/types/gql-pulse.d.ts'
import { useGqlPulseClient } from './useGqlPulseClient'

export const useGqlPulseRawRequest = async <ResT>(cxt: {
  document: string
  client?: TClients
  variables?: TVariables
}) => {
  const gqlPulseClient = useGqlPulseClient(
    cxt.client === undefined ? 'default' : cxt.client,
  )

  return await gqlPulseClient.rawRequest<ResT, TVariables>({
    query: cxt.document,
    variables: cxt.variables,
  })
}
