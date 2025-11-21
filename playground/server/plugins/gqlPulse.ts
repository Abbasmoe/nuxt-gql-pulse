import type { RequestInitExtended, ResponseMiddleware } from 'graphql-request'

export default defineNitroPlugin((nitroApp) => {
  const responseMiddleware: ResponseMiddleware = async (response) => {
    if (response instanceof Error) {
      console.error('❌ GraphQL error:', response.message)
    }
    else {
      console.log('✅ GraphQL response:', {
        status: response.status,
        hasErrors: Boolean(response.errors?.length),
      })
    }
  }

  // Add request middleware inside the request hook
  // to access dynamic headers (cookie, token, etc.) via event payload
  // for static headers can the middleware be added outside the request hook
  nitroApp.hooks.hook('request', (event) => {
    // const userToken = getCookie(event, 'auth_token');

    const requestMiddleware = async (request: RequestInitExtended) => ({
      ...request,
      headers: {
        ...request.headers,
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${userToken}`
      },
    })

    const client = event.context.$gqlPulse.rickandmortyapi

    client.requestConfig.requestMiddleware = requestMiddleware
    client.requestConfig.responseMiddleware = responseMiddleware
  })
})
