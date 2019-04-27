export const setSideComponent = {
  methods: {
    setSideComponent(component) {
      this.$store.dispatch('setSideComponent', component)
    }
  }
}

export const setUser = {
  methods: {
    setUser({ email }) {
      this.$store.dispatch('login', { user: email })
    }
  }
}

export const logout = {
  methods: {
    logout() {
      FB.logout(this.logout)
      this.$store.dispatch('logout')
    }
  }
}
