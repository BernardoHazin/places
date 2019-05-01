export const setSideComponent = {
  methods: {
    /**
     * @param {String} component - 'login', 'register' or 'search'
     * @description Set side map component to be displayed
     */
    setSideComponent(component) {
      this.$store.dispatch('setSideComponent', component)
    }
  }
}

export const logout = {
  methods: {
    /**
     * @description dispatch logout action to vuex store and Facebook logout function
     */
    logout() {
      FB.logout(() => {})
      this.$store.dispatch('logout')
    }
  }
}
