import Vue from 'vue'
import VueApollo from 'vue-apollo'
import store from './store'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'

// Install the vue plugin
Vue.use(VueApollo)

// Http endpoint
const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP ||
  'https://mesa-places.herokuapp.com/graphql'

// Config
const defaultOptions = {
  httpEndpoint,
  wsEndpoint:
    process.env.VUE_APP_GRAPHQL_WS ||
    'wss://mesa-places.herokuapp.com/subscriptions',
  tokenName: store.state.token,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
  getAuth() {
    return `Bearer ${store.state.token}`
  }
}

export function createProvider(options = {}) {
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  apolloClient.wsClient = wsClient

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'no-cache'
      }
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    }
  })

  return apolloProvider
}
