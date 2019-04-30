import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import * as VueGoogleMaps from 'vue2-google-maps'
import Notifications from 'vue-notification'

Vue.config.productionTip = false

Vue.use(Notifications)

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: 'places' // This is required if you use the Autocomplete plugin
  }
})

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
