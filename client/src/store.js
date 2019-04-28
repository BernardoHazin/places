import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    user: '',
    token: '',
    sideComponent: 'search'
  },
  mutations: {
    setSideComponent(state, component) {
      state.sideComponent = component
    },
    login(state, { email, token }) {
      console.log('store email', email)
      state.user = email
      state.token = token
      state.sideComponent = 'search'
    },
    logout(state) {
      state.user = ''
      state.token = ''
      state.sideComponent = 'search'
    }
  },
  actions: {
    setSideComponent({ commit }, component) {
      commit('setSideComponent', component)
    },
    login({ commit }, data) {
      commit('login', data)
    },
    logout({ commit }) {
      commit('logout')
    }
  },
  getters: {
    getAuthToken(state) {
      return state.token
    }
  }
})
