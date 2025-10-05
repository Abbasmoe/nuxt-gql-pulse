import type { TVariables } from '../../module'
import type { GraphQLError } from 'graphql'
import { useGqlPulseClient } from './useGqlPulseClient'

export const useGqlPulseRawRequest = async <ResT>(cxt: {
  document: string
  client?: TGqlPulseClientKey
  variables?: TVariables
}): Promise<{
  status: number
  headers: Headers
  data: ResT
  extensions?: unknown
  errors?: GraphQLError[]
}> => {
  const gqlPulseClient = useGqlPulseClient(cxt.client)

  return await gqlPulseClient.rawRequest<ResT, TVariables>({
    query: cxt.document,
    variables: cxt.variables,
  })
}
