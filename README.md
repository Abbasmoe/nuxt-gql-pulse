<p align="center">
  <img src="./nuxt-gql-pulse.png" width="400" alt="Nuxt GQL Pulse logo" />
</p>

# ⚡ Nuxt GQL Pulse

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt 3/4 module for making GraphQL requests with ease, leveraging the power of Nuxt's composables for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github//Abbasmoe/nuxt-gql-pulse?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

---

## ✨ Features

- 🔌 Multiple GraphQL client support
- ⚡ Composables built on Nuxt's `useAsyncData`
- 🗂️ Caching options:
  - **sessionStorage** (SPA-only) for persistent client cache
  - **Nuxt payload** (SSR-friendly) for server-side hydration
- 🛠️ Integrates with `graphql-request` (graffle-compatible)
- 📦 Works with Nuxt 3 and Nuxt 4
- 🧰 Composables:
  - `useGqlPulseClient(clientName)` — access raw client
  - `useGqlPulseRequest(...)` — simple request
  - `useGqlPulseRawRequest(...)` — low-level raw response
  - `useGqlPulseRequestWithCache(...)` — sessionStorage cache (SPA)
  - `useAsyncGqlPulse(...)` — SSR-friendly async data
  - `useAsyncGqlPulseWithCache(...)` — SPA async with sessionStorage
  - `useGqlPulseBatchRequests(...)` — batch multiple queries
  - `useAsyncGqlPulseBatch(...)` — async batch with optional payload cache

---

## 🚀 Quick Setup

Install the module and peer deps:

```bash
npm install nuxt-gql-pulse graphql graphql-request
```

Add it to your **nuxt.config.ts:**

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gql-pulse'],

  gqlPulse: {
    clients: {
      rickandmortyapi: {
        endpoint: 'https://rickandmortyapi.com/graphql',
      },
    },
  },
})
```

That’s it! You can now use Nuxt GQL Pulse in your Nuxt app ✨

### Example: Query characters from Rick & Morty API

```vue
<script setup lang="ts">
const query = /* GraphQL */ `
  query {
    characters(page: 1) {
      results {
        id
        name
        status
        species
      }
    }
  }
`

const { data } = await useAsyncGqlPulse<{
  characters: {
    results: { id: string; name: string; status: string; species: string }[]
  }
}>({
  client: 'rickandmortyapi',
  document: query,
})
</script>

<template>
  <div>
    <h2>Rick & Morty Characters</h2>
    <ul>
      <li v-for="character in data.characters.results" :key="character.id">
        {{ character.name }} — {{ character.status }} ({{ character.species }})
      </li>
    </ul>
  </div>
</template>
```

## 🔄 Comparison — Why choose Nuxt GQL Pulse?

Below is a practical comparison with relevant Nuxt GraphQL modules (research summary). This shows where features overlap and where nuxt-gql-pulse stands out.

| Capability / Module                          | **nuxt-gql-pulse** | `nuxt-graphql-request` |          `nuxt-graphql-client`           |  `nuxt-graphql-middleware`  |  `@nuxtjs/apollo` / URQL   |
| -------------------------------------------- | -----------------: | :--------------------: | :--------------------------------------: | :-------------------------: | :------------------------: |
| Multiple named clients                       |      ✅ (built-in) |           ✅           |                    ✅                    |     ⚠️ (server-focused)     |             ✅             |
| Composables on `useAsyncData`                |         ✅ (ready) |    ✅ (manual use)     |               ✅ (codegen)               |    ✅ (server wrappers)     |             ✅             |
| sessionStorage caching (client persistent)   |      ✅ **unique** |           ❌           |                    ❌                    | ❌ (in-memory/payload only) | ❌ (uses normalized cache) |
| Nuxt payload / SSR hydration cache           |                 ✅ |           ❌           |                    ⚠️                    |             ✅              |             ✅             |
| Integration with `graphql-request` / graffle |                 ✅ |           ✅           | ⚠️ (may use different clients / codegen) |      ⚠️ (server fetch)      |      ❌ (Apollo/URQL)      |
| Raw response (`rawRequest`) support          |                 ✅ |           ✅           |                    ⚠️                    |             ⚠️              |    ✅ (client-specific)    |
| Batch requests helper                        |                 ✅ |      ⚠️ (manual)       |                    ⚠️                    |             ⚠️              |   ✅ (depends on client)   |
| Nuxt 3 / 4 support                           |                 ✅ |           ✅           |                    ✅                    |             ✅              |             ✅             |
| Lightweight / minimal runtime footprint      |                 ✅ |           ✅           |           ⚠️ (may add codegen)           |             ⚠️              |     ❌ (Apollo larger)     |

## 📄 Documentation

### ⚙️ Configuration (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gql-pulse'],

  gqlPulse: {
    /**
     * Define your GraphQL clients
     */
    clients: {
      default: {
        /**
         * The client endpoint URL
         */
        endpoint: 'https://rickandmortyapi.com/graphql',

        /**
         * Per-client request configuration
         * Docs: https://github.com/graffle-js/graffle/blob/graphql-request/examples/configuration-fetch-options.ts
         */
        options: {
          method?: 'GET' | 'POST';
          headers?: Headers | string[][] | Record<string, string> | (() => Headers | string[][] | Record<string, string>);
          requestMiddleware?: (request: RequestExtendedInit<Variables>) => RequestExtendedInit<Variables> | Promise<RequestExtendedInit<Variables>>;
          responseMiddleware?: (response: GraphQLClientResponse<unknown> | Error) => void;
          jsonSerializer?: JsonSerializer;
          body?: string | ReadableStream<any> | Blob | ArrayBuffer | ArrayBufferView<ArrayBuffer> | FormData | URLSearchParams | null;
          cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
          credentials?: 'include' | 'omit' | 'same-origin';
          integrity?: string;
          keepalive?: boolean;
          mode?: 'same-origin' | 'cors' | 'navigate' | 'no-cors';
          priority?: 'auto' | 'high' | 'low';
          redirect?: 'error' | 'follow' | 'manual';
          referrer?: string;
          referrerPolicy?: '' | 'same-origin' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
          signal?: AbortSignal | null;
          window?: null;
          errorPolicy?: 'none' | 'ignore' | 'all';
        }
      },
      secondClient: {
        // ... another client config
      },
    },

    /**
     * Global options applied to all clients
     */
    options: {
      // same structure as per-client `options`
    },

    /**
     * Optional
     * By default, all composables are auto-imported.
     *
     * You can exclude some if you only use one or two.
     *
     * Available auto-import composables:
     * [
     *  'useGqlPulseRequest',
     *  'useGqlPulseRequestWithCache',
     *  'useGqlPulseBatchRequests',
     *  'useGqlPulseRawRequest',
     *  'useAsyncGqlPulse',
     *  'useAsyncGqlPulseWithCache',
     *  'useAsyncGqlPulseBatch',
     * ]
     *
     * ⚠️ `useGqlPulseClient` is **always** imported by default
     * and cannot be excluded.
     */
    excludeComposables: [],
  },
})
```

**🔑 Type Declarations (gql-pulse.d.ts)**

```ts
import type { GraphQLClient } from 'graphql-request'

export type TClients = 'rickandmortyapi'

declare module '#app' {
  interface NuxtApp {
    $gqlPulse: Record<TClients, GraphQLClient>
  }
}

export {}
```

### 🧩 Composables Overview

🔧 API quick reference (signatures)

- useGqlPulseClient(clientName: string): GraphQLClient — get raw client
- useGqlPulseRequest<T>(opts): Promise<T>
  opts = { document, client?, variables? }
- useGqlPulseRawRequest<T>(opts): Promise<{ status, headers, data, errors?, extensions? }>
- useGqlPulseRequestWithCache<T>(opts): Promise<RemovableRef<T>> — sessionStorage cache (SPA)
- useAsyncGqlPulse(opts): AsyncDataReturn — SSR-friendly useAsyncData wrapper
- useAsyncGqlPulseWithCache(opts): AsyncDataReturn — SPA sessionStorage cache variant
- useGqlPulseBatchRequests(opts): Promise<BatchResult> — batch many queries at once
- useAsyncGqlPulseBatch(opts): AsyncDataReturn — batched useAsyncData with optional payload cache

🔁 Caching: SSR vs SPA

- withPayloadCache / useAsyncGqlPulse → SSR-friendly, data is stored in Nuxt payload and reused during client hydration (no double-fetch).
- \*WithCache variants & useGqlPulseRequestWithCache → SPA only (use sessionStorage via @vueuse/core).
  Use these for client-persistent caching across reloads; not suitable for SSR-only pages.

#### 🔧 API details

**useGqlPulseRequest**

```ts
// Make standard GraphQL requests.
const data = await useGqlPulseRequest({
  document, // string | DocumentNode 
  client: string, // defaults to first client
  variables: TVariables,
})
```

**useGqlPulseRawRequest**

```ts
// Low-level request returning headers, status, and errors.
const res = await useGqlPulseRawRequest({
  document: string,
  client: string,
  variables: TVariables,
}) // { status, headers, data, extensions, errors? }
```

**useGqlPulseClient**

```ts
// Access the underlying GraphQLClient instance.
// Always auto-imported and cannot be excluded.
const client = useGqlPulseClient('default')
```

**useAsyncGqlPulse**

```ts
// Nuxt-friendly async data fetching with optional payload cache. (SSR Friendly)
const { data, pending, error } = await useAsyncGqlPulse({
  key: 'characters',
  document,
  variables,
  client: 'default',
  withPayloadCache: true,
})
```

**useAsyncGqlPulseWithCache**

```ts
// SPA-only sessionStorage caching.
const data = await useAsyncGqlPulseWithCache({
  key: 'characters',
  document,
  variables,
})
```

**useGqlPulseBatchRequests**

```ts
// Batch multiple queries into one request.
const result = await useGqlPulseBatchRequests({
  documents: [
    { document: query1, variables: { id: 1 } },
    { document: query2, variables: { id: 2 } },
  ],
  client: 'default',
})
```

**useAsyncGqlPulseBatch**

```ts
// Nuxt-friendly async data fetching for batched requests with optional payload cache. (SSR Friendly)
const { data, pending, error } = await useAsyncGqlPulseBatch({
  key: 'batch-1',
  documents: [
    { document: query1, variables: { id: 1 } },
    { document: query2, variables: { id: 2 } },
  ],
  client: 'default',
  withPayloadCache: true,
})
```

**useGqlPulseRequestWithCache**

```ts
// SPA-only sessionStorage caching for single requests.
const result = await useGqlPulseRequestWithCache({
  key: 'character-1',
  document,
  variables,
})
```

### 🔌 Runtime Clients (plugins/gqlPulse.ts)

You can also provide runtime-defined clients via a Nuxt plugin:

```ts
export default defineNuxtPlugin(() => {
  const requestMiddleware = async (
    request: RequestExtendedInit<Variables>
  ) => ({
    ...request,
    headers: {
      ...request.headers,
      Authorization: `Bearer token`,
    },
  })

  const responseMiddleware = async (
    response: GraphQLClientResponse<unknown> | Error
  ) => {
    // custom error handling...
  }

  const defaultClient = new GraphQLClient('defaultClient/api/graphql', {
    requestMiddleware,
    responseMiddleware,
  })

  const secondClient = new GraphQLClient('secondClient/api/graphql', {
    requestMiddleware,
    responseMiddleware,
  })

  return {
    provide: {
      gqlPulse: {
        default: defaultClient,
        secondClient,
      },
    },
  }
})
```

## 🧑‍💻 Usage Examples

See the [examples directory](./examples) for more usage examples:

- [Basic Fetch (useGqlPulseRequest)](./examples/basic-fetch.md)
- [Async Data Fetching (useAsyncGqlPulse)](./examples/async-data.md)
- [Using with Pinia (useGqlPulseRequest in Store)](./examples/pinia.md)

### ⚙️ Configuration details

gqlPulse.clients[clientName].options mirrors the request options available in graffle/graphql-request (headers, method, requestMiddleware, responseMiddleware, etc.). See graffle examples for advanced options and middleware.
See the [ `graphql-request` / graffle](https://github.com/graffle-js/graffle/blob/graphql-request/examples). for advanced request configuration and middleware examples.

## 📑 License & Acknowledgements

This project builds on and integrates the excellent work of the GraphQL community:

- [graffle / graphql-request](https://github.com/graffle-js/graffle) – lightweight GraphQL client used internally.  
  Please see their repository for license details (MIT-compatible).

This package itself is released under the [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-gql-pulse/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-gql-pulse
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-gql-pulse.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-gql-pulse
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
