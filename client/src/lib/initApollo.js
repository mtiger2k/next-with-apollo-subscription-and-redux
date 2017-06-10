import { ApolloClient } from 'react-apollo'
import {createNetworkInterface} from 'apollo-upload-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import fetch from 'isomorphic-fetch'

const GRAPHQL_URL = 'http://localhost:4000/graphql'
const WS_URL = 'ws://localhost:4000/subscriptions'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create () {
  const ssrMode = !process.browser

  let networkInterface = createNetworkInterface({
    uri: GRAPHQL_URL,
    opts: {
      credentials: 'same-origin'
    }
  })

  if (!ssrMode) {
    const wsClient = new SubscriptionClient(WS_URL, {
      reconnect: true
    })

    networkInterface = addGraphQLSubscriptions(
      networkInterface,
      wsClient
    )
  }

  return new ApolloClient({
    ssrMode, // Disables forceFetch on the server (so queries are only run once)
    networkInterface,
    dataIdFromObject: result => result.id || null,
  })
}

export default function initApollo () {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create()
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create()
  }

  return apolloClient
}
