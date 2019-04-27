<template>
  <div>
    <div class="col">
      <div class="row ac">
        <v-btn icon @click="setSideComponent('search')">
          <v-icon color="primary">fas fa-chevron-left</v-icon>
        </v-btn>
        <h3 class="fs-2 primary--text">Entrar</h3>
      </div>
      <v-form class="pa-2 col mt-2" lazy-validation @submit.prevent="toLogin">
        <v-text-field
          box
          v-model="email"
          :disabled="loading"
          label="Email"
        ></v-text-field>
        <v-text-field
          box
          v-model="password"
          :disabled="loading"
          type="password"
          label="Senha!"
        ></v-text-field>
        <div class="row jc">
          <v-btn
            type="submit"
            color="primary"
            :disabled="loading || !email || !password"
            :loading="loading"
            >Entrar
          </v-btn>
          <v-btn dark @click="fblogin" color="#3b5998" :disabled="loading">
            <v-icon>fab fa-facebook-f</v-icon>
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { setSideComponent, setUser } from '@/mixins'
import gql from 'graphql-tag'

export default {
  mixins: [setSideComponent, setUser],
  data() {
    return {
      loading: false,
      email: '',
      password: ''
    }
  },
  methods: {
    fblogin() {
      FB.login(this.userInfo, { scope: 'email' })
    },
    toLogin() {
      this.loading = true
      this.$apollo
        .query({
          query: gql`
            query login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                email
              }
            }
          `,
          variables: {
            email: this.email,
            password: this.password
          }
        })
        .then(({ data }) => {
          this.$store.dispatch('login', { user: data.login.email })
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: 'Error ao efetuar login',
            text: err.message.replace('GraphQL error: ', '')
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

