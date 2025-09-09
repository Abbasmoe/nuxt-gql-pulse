<template>
  <div class="character-list-container">
    <h1 class="title">
      Rick and Morty Characters
    </h1>

    <div
      v-if="charactersResponse"
      class="character-grid"
    >
      <div
        v-for="character in charactersResponse.characters.results"
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
const charactersResponse = await useGqlPulseRequest<TCharactersResponse>({
  client: 'rickandmortyapi',
  document: query,
  variables: { page: 1 },
})
</script>

<style scoped>
.character-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.character-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.character-card:hover {
  transform: translateY(-5px);
}

.character-image {
  width: 100%;
  height: auto;
  display: block;
}

.character-details {
  padding: 15px;
}

.character-name {
  font-size: 1.4em;
  margin: 0 0 10px;
  color: #34495e;
}

.character-info {
  margin: 5px 0;
  font-size: 0.9em;
  color: #555;
}
</style>
