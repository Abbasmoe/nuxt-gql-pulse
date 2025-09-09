import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures', import.meta.url)),
  })

  it('renders Rick and Morty characters', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/indexPage')
    // check for some known characters from the API
    expect(html).toMatch(/Rick Sanchez|Morty Smith/)
  })
})
