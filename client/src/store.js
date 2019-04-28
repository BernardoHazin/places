import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    user: '',
    name: '',
    profileImg: '',
    token: '',
    sideComponent: 'search'
  },
  mutations: {
    setSideComponent(state, component) {
      state.sideComponent = component
    },
    login(state, { email, token, profileImg, name }) {
      state.user = email
      state.name = name
      state.token = token
      state.profileImg = profileImg
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
