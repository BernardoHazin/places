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
    favorites: [],
    token: '',
    sideComponent: 'search'
  },
  mutations: {
    setSideComponent(state, component) {
      state.sideComponent = component
    },
    login(state, { email, token, profileImg, name, favorites }) {
      state.email = email
      state.name = name
      state.token = token
      state.profileImg = profileImg
      state.favorites = favorites
      state.sideComponent = 'search'
    },
    logout(state) {
      state.email = ''
      state.token = ''
      state.favorites = []
      state.sideComponent = 'search'
    },
    setName(state, name) {
      state.name = name
    },
    setToken(state, token) {
      state.token = token
    },
    addFavorite(state, place) {
      console.log('Add')
      state.favorites.push(place)
    },
    removeFavorite(state, index) {
      console.log('Remove', state.favorites, index)
      state.favorites.splice(index, 1)
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
    },
    addFavorite({ commit }, id) {
      commit('addFavorite', id)
    },
    removeFavorite({ commit }, id) {
      commit('removeFavorite', id)
    }
  },
  getters: {
    getAuthToken(state) {
      return state.token
    }
  }
})
