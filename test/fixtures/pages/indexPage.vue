<template>
  <div>
    <h1>Rick and Morty Characters</h1>

    <div
      v-for="character in data.characters.results"
      :key="character.id"
    >
      {{ character.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Characters from '../graphql/characters.gql'
import { useAsyncGqlPulse } from '#imports'

interface Character {
  id: string
  name: string
  status: string
  species: string
  type: string
  gender: string
  image: string
}

interface TCharactersResponse {
  characters: {
    results: Character[]
  }
}

const { data } = await useAsyncGqlPulse<TCharactersResponse>({
  client: 'rickandmortyapi',
  document: Characters,
  variables: { page: 1 },
})
</script>
