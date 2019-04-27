import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    sideComponent: 'search'
  },
  mutations: {
    setSideComponent(state, component) {
      state.sideComponent = component
    },
    login(state, { user }) {
      state.user = user
      state.sideComponent = 'search'
    },
    logout(state) {
      state.user = ''
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
  }
})
