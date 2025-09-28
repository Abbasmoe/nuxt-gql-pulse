## Async Data (useAsyncGqlPulse)

For pages or components that need to load data asynchronously, use useAsyncGqlPulse.
This composable behaves similarly to useAsyncData, automatically fetching data on setup. 
Here we fetch the first page of episodes and display their names and air dates. 
Reactive properties like pending (loading state) and error are provided.
This query uses the episodes list from the API. Key is optional but useful for SSR payload caching.
payload cache is also optional and can be enabled for SSR payload caching.

```vue
<template>
  <div>
    <h2>Episodes (Page 1):</h2>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else-if="pending">Loading episodes...</div>
    <ul v-else>
      <li v-for="ep in data.episodes.results" :key="ep.id">
        {{ ep.name }} – Air date: {{ ep.air_date }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Episode {
  id: string
  name: string
  air_date: string
}

interface TEpisodesResponse {
  episodes: {
    results: Episode[]
    info: {
      count: number
    }
  }
}

const GET_EPISODES = gql`
  query GetEpisodes($page: Int) {
    episodes(page: $page) {
      info { count }
      results {
        id
        name
        air_date
      }
    }
  }
`

// Fetch episodes page 1 reactively
const { data, pending, error } = useAsyncGqlPulse<TEpisodesResponse>({
  key: 'episodes-page-1' // Optional cache key for SSR payload
  client: 'rickandmortyapi',
  document: GET_EPISODES,
  variables: { page: 1 },
  withPayloadCache: true // Optional SSR payload cache for SSR payload
})
</script>
```
