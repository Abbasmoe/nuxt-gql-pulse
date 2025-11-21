<p align="center">
  <img src="./nuxt-gql-pulse.png" width="400" alt="Nuxt GQL Pulse logo" />
</p>

# ⚡ Nuxt GQL Pulse

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt 3/4 module for making GraphQL requests with ease, leveraging the power of Nuxt's composables for doing amazing things.

  <!-- - [📓 &nbsp;Release Notes](/CHANGELOG.md) -->
  <!-- - [🏀 Online playground](https://stackblitz.com/github//Abbasmoe/nuxt-gql-pulse?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

## ✨ Features

- 🔌 Multiple GraphQL client support
- ⚡ Composables built on Nuxt's `useAsyncData`
- 🎯 Simple API, minimal boilerplate
- 🧩 Flexible request options per-client and per-request
- 🔄 SSR-friendly with Nuxt payload caching
- 🛰 Nitro-ready: use GraphQL clients directly in `server/api` via `event.context.$gqlPulse`
- 🦾 **Type Strong:** type-safe client names (via global `TGqlPulseClientKey` type)
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

### Example: Query characters from Rick & Morty API (client/composables)

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

### Example: Use in Nitro server route (server/api)

Nuxt GQL Pulse exposes your configured clients to Nitro via `event.context.$gqlPulse`, so you can reuse the same GraphQL setup in server handlers.

```ts
// server/api/characters.get.ts
import Characters from '../graphql/characters.gql'

export default defineEventHandler(async (event) => {
  const client = event.context.$gqlPulse.rickandmortyapi

  const data = await client.request(Characters)

  return data
})
```

This allows you to make typed GraphQL requests directly inside server/api without redefining clients or endpoints.

You can explore a running version of this example in the Playground, including client-side and server-side usage:

👉 [Playground](./playground/pages/server.vue)

On the client, you simply consume that API with useFetch / useAsyncData:

```vue
<script setup lang="ts">
const { data } = await useFetch<{
  characters: {
    results: { id: string; name: string; status: string; species: string }[]
  }
}>('/api/characters')
</script>
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
      // 'rickandmortyapi' was used in examples above instead of 'default'
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
          cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
          credentials?: 'include' | 'omit' | 'same-origin';
          integrity?: string;
          keepalive?: boolean;
          mode?: 'same-origin' | 'cors' | 'navigate' | 'no-cors';
          priority?: 'auto' | 'high' | 'low';
          redirect?: 'error' | 'follow' | 'manual';
          referrer?: string;
          referrerPolicy?: '' | 'same-origin' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
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

**🔑 Type Declarations (index.d.ts)**

if you want to have type-safe client names in your project,
you can declare the `TGqlPulseClientKey` type globally in your project.
normally this is auto-generated in `.nuxt/types/gql-pulse.d.ts` during build,
but you can also declare it manually in your project for better DX.

```ts
declare global {
  type TGqlPulseClientKey = 'rickandmortyapi'
}

export {}
```

### 🧩 Composables Overview

🔧 API quick reference (signatures)

- useGqlPulseClient(clientName: string | "default"): GraphQLClient — get raw client
- useGqlPulseRequest<T>(opts): Promise<T>
  opts = { document, client?, variables? }
- useGqlPulseRawRequest<T>(opts): Promise<{ status, headers, data, errors?, extensions? }>
- useGqlPulseRequestWithCache<T>(opts): Promise<RemovableRef<T>> — sessionStorage cache (SPA via @vueuse/core)
- useAsyncGqlPulse(opts): AsyncDataReturn — SSR-friendly useAsyncData wrapper
- useGqlPulseBatchRequests(opts): Promise<BatchResult> — batch many queries at once
- useAsyncGqlPulseBatch(opts): AsyncDataReturn — batched useAsyncData with optional payload cache

🔁 Caching: SSR vs SPA

- `withPayloadCache` / `useAsyncGqlPulse` → SSR-friendly, data is stored in Nuxt payload and reused during client hydration (no double-fetch).
- `*WithCache` variants & `useGqlPulseRequestWithCache` → SPA only. They use `sessionStorage` via `@vueuse/core`, providing client-persistent caching across reloads.
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

This feature depends on `@vueuse/core`. Install it only if you intend to use this SPA-only caching API.  
Tree-shaking ensures that only the specific VueUse utilities you import are included, so it will not increase your bundle size.

```bash
npm i -D @vueuse/core
```

```ts
// SPA-only sessionStorage caching for single requests.
const result = await useGqlPulseRequestWithCache({
  key: 'character-1',
  document,
  variables,
})
```

### 🔌 Clients custom configuration (plugins/gqlPulse.ts)

You can also provide custom configuration to clients via a Nuxt plugin:

```ts
export default defineNuxtPlugin(() => {
  const client = useGqlPulseClient('rickandmortyapi')
  const secondClient = useGqlPulseClient('secondClient')

  /**
   * Request middleware
   * Runs before every GraphQL request.
   * You can modify headers, body, or any request config here.
   */
  const requestMiddleware = async (
    request: RequestExtendedInit<Variables>
  ) => ({
    ...request,
    headers: {
      ...request.headers,
      Authorization: `Bearer token`,
    },
  })

  /**
   * Response middleware
   * Runs after every GraphQL response.
   * Perfect for custom logging or error handling.
   */
  const responseMiddleware = async (
    response: GraphQLClientResponse<unknown> | Error
  ) => {
    if (response instanceof Error) {
      console.error('❌ GraphQL error:', response.message)
    } else {
      console.log('✅ Response received:', response)
    }
  }

  // Apply middlewares to both clients
  for (const c of [client, secondClient]) {
    c.requestConfig.requestMiddleware = requestMiddleware
    c.requestConfig.responseMiddleware = responseMiddleware
  }

  /**
   * Optional: override other requestConfig options
   */
  // client.requestConfig.jsonSerializer = JSON
  // client.requestConfig.body = JSON.stringify({ query: "{ characters { name } }" })
  // client.requestConfig.signal = AbortSignal.timeout(5000)
  // client.requestConfig.window = null
})
```

### ⚡ Server-side middleware (Nitro `server/plugins`)

If you are calling GraphQL from `server/api` routes (or other Nitro handlers), client-side plugins in `plugins/` will **not** apply to those server-side requests.

Nuxt GQL Pulse exposes your configured clients on the Nitro event via `event.context.$gqlPulse`.

To add per-request middleware (e.g. attach auth tokens from cookies), define a Nitro plugin under `server/plugins/`:

```ts
import type { RequestInitExtended, ResponseMiddleware } from 'graphql-request'

export default defineNitroPlugin((nitroApp) => {
  const responseMiddleware: ResponseMiddleware = async (response) => {
    if (response instanceof Error) {
      console.error('❌ GraphQL error:', response.message)
    } else {
      console.log('✅ GraphQL response:', {
        status: response.status,
        hasErrors: Boolean(response.errors?.length),
      })
    }
  }

  nitroApp.hooks.hook('request', (event) => {
    // Read user token from cookies (or headers)
    const token = getCookie(event, 'auth_token')

    const requestMiddleware = async (request: RequestInitExtended) => ({
      ...request,
      headers: {
        ...request.headers,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const clients = event.context.$gqlPulse
    if (!clients) return

    // Apply middleware to all configured clients
    for (const client of Object.values(clients)) {
      client.requestConfig.requestMiddleware = requestMiddleware
      client.requestConfig.responseMiddleware = responseMiddleware
    }
  })
})
```

### 👮🏽‍♂️ Authentication

You can also provide Authentication headers in different ways:

1. **Static headers** in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  gqlPulse: {
    clients: {
      default: {
        endpoint: 'https://default.com/graphql',
        options: {
          headers: {
            authorization: 'Bearer TOKEN_HERE',
          },
        },
      },
    },
  },
})
```

2. **Dynamic headers** using `requestMiddleware` in `plugins/gqlPulse.ts`:

```ts
const client = useGqlPulseClient('default')

const requestMiddleware = async (request: RequestExtendedInit<Variables>) => {
  const token = await getAuthTokenSomehow()
  return {
    ...request,
    headers: {
      ...request.headers,
      authorization: `Bearer ${token}`,
    },
  }
}

client.requestConfig.requestMiddleware = requestMiddleware
```

3. **Per-request headers** using `useGqlPulseRequest` options:

```ts
const data = await useGqlPulseRequest({
  document,
  client: 'default',
  variables,
  requestOptions: {
    headers: {
      authorization: `Bearer ${token}`,
    },
  },
})
```

4. using **setHeaders()** or **setHeader()** from `useGqlPulseClient()`:

```ts
const client = useGqlPulseClient('rickandmortyapi')

// Replace all existing headers
client.setHeaders({
  Authorization: 'Bearer my-secret-token',
  'Content-Type': 'application/json',
})

// Set one header without touching the rest
client.setHeader('x-custom-header', 'my-value')

// Point the client to a different GraphQL endpoint
client.setEndpoint('https://custom-api.example.com/graphql')
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
