import Characters from '../graphql/characters.gql'

export default defineEventHandler(async (event) => {
  const client = event.context.$gqlPulse.rickandmortyapi

  const data = await client.request(Characters)

  return data
})
