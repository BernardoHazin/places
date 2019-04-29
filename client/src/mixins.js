export const setSideComponent = {
  methods: {
    setSideComponent(component) {
      this.$store.dispatch('setSideComponent', component)
    }
  }
}

export const setUser = {
  methods: {
    setUser({ email, name }, accessToken) {
      console.log(email, name)
      this.$store.dispatch('login', { email, token: accessToken })
    }
  }
}

export const logout = {
  methods: {
    logout() {
      FB.logout(() => {})
      this.$store.dispatch('logout')
    }
  }
}
