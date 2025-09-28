## Basic Fetch (useGqlPulseRequest)

The simplest use case is useGqlPulseRequest, which performs a GraphQL query and returns reactive data and status.
In this example, we fetch a list of characters (page 1, filtered by name) and display their names and statuses. The result is reactive and can be used in the template.

```vue
<template>
  <div>
    <h2>Characters (Page 1, name contains "Rick"):</h2>
    <button @click="fetchCharacters">Fetch Characters</button>
    <ul>
      <li v-for="character in characters" :key="character.id">
        {{ character.name }} – {{ character.status }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Character {
  id: string
  name: string
  status: string
}

interface TCharactersResponse {
  characters: {
    results: Character[]
    info: {
      count: number
    }
  }
}

const GET_CHARACTERS = `
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info { count }
      results {
        id
        name
        status
      }
    }
  }
`

const characters = ref<Character[]>([])

const fetchCharacters = async () => {
  // Perform the request using the 'rickandmortyapi' client
  const data = await useGqlPulseRequest<TCharactersResponse>({
    client: 'rickandmortyapi',
    document: GET_CHARACTERS,
    variables: { page: 1, filter: { name: 'Rick' } }
  })

  // Update reactive data
  characters.value = data.characters.results
}
</script>
```
