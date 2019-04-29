import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    email: '',
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
      state.email = email
      state.name = name
      state.token = token
      state.profileImg = profileImg
      state.sideComponent = 'search'
    },
    logout(state) {
      state.email = ''
      state.token = ''
      state.sideComponent = 'search'
    },
    setName(state, name) {
      state.name = name
    },
    setToken(state, token) {
      state.token = token
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
    },
    setName({ commit }, name) {
      commit('setName', name)
    },
    setToken({ commit }, token) {
      commit('setToken', token)
    }
  },
  getters: {
    getAuthToken(state) {
      return state.token
    }
  }
})
