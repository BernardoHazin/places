<template>
  <div class="fph col jc">
    <v-form @submit.prevent="changePassword">
      <v-layout column align-center justify-center>
        <v-flex xs6>
          <v-text-field
            box
            label="Senha atual"
            v-model="password"
            type="password"
          ></v-text-field>
          <v-text-field
            box
            label="Nova senha"
            type="password"
            v-model="newPassword"
          ></v-text-field>
          <v-text-field
            box
            label="Confirmar nova senha"
            type="password"
            v-model="confirmNewPassword"
          ></v-text-field>
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="isDisabled"
            >Alterar senha</v-btn
          >
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  computed: {
    isDisabled() {
      return (
        !this.password ||
        !this.newPassword ||
        !this.confirmNewPassword ||
        this.confirmNewPassword !== this.newPassword
      )
    }
  },
  data() {
    return {
      loading: false,
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  },
  created() {
    this.$store.dispatch('setToken', this.$route.params.id)
  },
  methods: {
    changePassword() {
      this.loading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation changePassword($password: String!, $newPassword: String!) {
              changePassword(password: $password, newPassword: $newPassword)
            }
          `,
          variables: {
            password: this.password,
            newPassword: this.newPassword
          }
        })
        .then(res => {
          this.$notify({
            type: 'success',
            title: 'Alterar senha',
            text: 'Senha alterada com sucesso!'
          })
          this.$router.push({ name: 'home' })
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
