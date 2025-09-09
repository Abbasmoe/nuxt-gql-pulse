<template>
  <div>
    <h1>Rick and Morty Characters</h1>

    <div
      v-for="character in charactersResponse.characters.results"
      :key="character.id"
    >
      {{ character.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Characters from '../graphql/characters.gql'
import { useGqlPulseRequest } from '#imports'

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

const charactersResponse = await useGqlPulseRequest<TCharactersResponse>({
  client: 'rickandmortyapi',
  document: Characters,
  variables: { page: 1 },
})
</script>
