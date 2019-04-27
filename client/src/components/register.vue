<template>
  <div>
    <div class="col">
      <div class="row ac">
        <v-btn icon @click="setSideComponent('search')">
          <v-icon color="primary">fas fa-chevron-left</v-icon>
        </v-btn>
        <h3 class="fs-2 primary--text">Cadastrar-se</h3>
      </div>
      <v-form class="pa-2 col mt-2" lazy-validation @submit.prevent="register">
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
          :type="seePassword ? 'text' : 'password'"
          :append-icon="seePassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
          @click:append="seePassword = !seePassword"
          label="Senha!"
        ></v-text-field>
        <v-btn
          type="submit"
          color="primary"
          :disabled="loading || !email || !password"
          :loading="loading"
          >Cadastrar
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import { setSideComponent } from '@/mixins'
import gql from 'graphql-tag'

export default {
  mixins: [setSideComponent],
  data() {
    return {
      loading: false,
      seePassword: false,
      email: '',
      password: ''
    }
  },
  methods: {
    register() {
      this.loading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation registerUser($email: String!, $password: String!) {
              registerUser(email: $email, password: $password) {
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
          this.$notify({
            type: 'success',
            title: 'Cadastro',
            text: 'Cadastro realizado com suceeso!'
          })
          this.$store.dispatch('login', { user: data.registerUser.email })
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: 'Error ao efetuar cadastro',
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

