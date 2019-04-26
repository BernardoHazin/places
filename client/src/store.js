import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sideComponent: 'search'
  },
  mutations: {
    setSideComponent(state, component) {
      state.sideComponent = component
    }
  },
  actions: {
    setSideComponent({ commit }, component) {
      commit('setSideComponent', component)
    }
  }
})
