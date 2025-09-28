## Pinia Store Example (with useGqlPulseRequest)

This example demonstrates how to use nuxt-gql-pulse with Pinia.
We’ll fetch characters from the Rick & Morty API and store them in a global state that can be shared across components.

### ⚠️ Note:
This is only an example.
How you handle loading states and error management may differ from project to project 
(e.g., you might use global error handlers, Nuxt error boundaries, or a UI framework’s loading spinner instead).

```ts
// stores/characterStore.ts
import { defineStore } from 'pinia'

interface Character {
  id: string
  name: string
  status: string
}

interface TCharactersResponse {
  characters: {
    results: Character[]
    info: { count: number }
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

export const useCharacterStore = defineStore('character', () => {
  // combined state
  const state = reactive({
    characters: [] as Character[],
    totalCount: 0,
    loading: false,
    error: null as string | null,
  })

  // action
  const fetchCharacters = async () => {
    state.loading = true
    state.error = null

    try {
      const data = await useGqlPulseRequest<TCharactersResponse>({
        client: 'rickandmortyapi',
        document: GET_CHARACTERS,
        variables: { page: 1, filter: { name: 'Rick' } },
      })

      state.characters = data.characters.results
      state.totalCount = data.characters.info.count
    } catch (err: any) {
      state.error = err.message || 'Failed to fetch characters'
    } finally {
      state.loading = false
    }
  }

  return { state, fetchCharacters }
})
```

### Component Usage
```vue
<template>
  <div>
    <h2>Characters (Page 1, name contains "Rick")</h2>

    <button @click="fetchCharacters" :disabled="store.state.loading">
      {{ store.state.loading ? 'Loading...' : 'Fetch Characters' }}
    </button>

    <p v-if="store.state.error" class="error">Error: {{ store.state.error }}</p>

    <ul v-if="store.state.characters.length">
      <li v-for="character in store.state.characters" :key="character.id">
        {{ character.name }} – {{ character.status }}
      </li>
    </ul>

    <p v-if="!store.state.characters.length && !store.state.loading">
      No characters yet.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from '@/stores/characterStore'

const characterStore = useCharacterStore()
const { fetchCharacters } = characterStore
const { state } = storeToRefs(characterStore)
</script>
```
