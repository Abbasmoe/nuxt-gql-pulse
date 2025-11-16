<template>
  <div class="character-list-container">
    <h1 class="title">
      Rick and Morty Characters (client/composables)
    </h1>

    <p v-if="pending">
      Loading characters…
    </p>
    <p v-else-if="error">
      Failed to load characters.
    </p>
    <div
      v-else-if="data"
      class="character-grid"
    >
      <div
        v-for="character in data.characters.results"
        :key="character.id"
        class="character-card"
      >
        <img
          :src="character.image"
          :alt="character.name"
          class="character-image"
        >
        <div class="character-details">
          <h2 class="character-name">
            {{ character.name }}
          </h2>
          <p class="character-info">
            Status: {{ character.status }}
          </p>
          <p class="character-info">
            Species: {{ character.species }}
          </p>
          <p class="character-info">
            Gender: {{ character.gender }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const query = `
  query ($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        status
        species
        type
        gender
        image
      }
    }
  }
`
const { data, pending, error } = await useAsyncGqlPulse<TCharactersResponse>({
  client: 'rickandmortyapi',
  document: query,
  variables: { page: 1 },
})
</script>
