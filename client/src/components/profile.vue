<template>
  <div>
    <v-card>
      <v-card-title
        dark
        style="white-space: wrap;"
        class="title primary white--text"
      >
        Perfil
        <v-spacer />
        <v-btn icon @click="$emit('close')" dark>
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <img
          :src="profileImg"
          alt="Profile image"
          width="150px"
          style="border-radius: 50%;"
        />
        <v-text-field
          box
          label="Email"
          ref="emailInput"
          v-model="inputEmail"
          readonly
        ></v-text-field>
        <v-text-field
          box
          label="Nome"
          ref="nameInput"
          v-model="inputName"
          :loading="loading"
          append-icon="fas fa-pen"
          @keypress="changeName"
          @blur="changeName"
        ></v-text-field>
        <v-btn
          color="primary"
          @click.once="changePassword"
          :loading="passwordLoading"
          >Alterar senha</v-btn
        >
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { logout, setSideComponent } from '@/mixins'

export default {
  mixins: [logout, setSideComponent],
  props: ['email', 'name', 'profileImg'],
  computed: {
    inputEmail: {
      get() {
        return this.newEmail || this.email
      },
      set(val) {
        this.newEmail = val
      }
    },
    inputName: {
      get() {
        return this.newName || this.name
      },
      set(val) {
        this.newName = val
      }
    }
  },
  data() {
    return {
      loading: false,
      passwordLoading: false,
      newEmail: '',
      newName: ''
    }
  },
  methods: {
    changePassword() {
      this.passwordLoading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation changePasswordRequest {
              changePasswordRequest
            }
          `
        })
        .then(res => {
          this.$notify({
            type: 'success',
            title: 'Alterar senha',
            text: 'Acesse seu email para continuar'
          })
          console.log(res)
        })
        .catch(err => {
          this.$emit('close')
          if (err.message === 'GraphQL error: Sessão inválida') {
            this.logout()
            this.setSideComponent('login')
            this.$notify({
              type: 'error',
              title: 'Sessão',
              text: 'Sessão encerrada'
            })
          } else {
            this.$notify({
              type: 'error',
              title: 'Error',
              text: err.message.replace('GraphQL error: ', '')
            })
          }
        })
        .finally(() => {
          this.passwordLoading = false
        })
    },
    changeName({ charCode }) {
      if (charCode === 13 && this.newName) {
        this.loading = true
        this.$apollo
          .mutate({
            mutation: gql`
              mutation changeName($name: String!) {
                changeName(name: $name) {
                  name
                }
              }
            `,
            variables: {
              name: this.newName
            }
          })
          .then(({ data }) => {
            console.log(data)
            this.$notify({
              type: 'success',
              title: 'Alterar nome',
              text: 'Nome de usuário alterado com sucesso!'
            })
            this.$store.dispatch('setName', data.changeName.name)
          })
          .catch(err => {
            this.$emit('close')
            if (err.message === 'GraphQL error: Sessão inválida') {
              this.logout()
              this.setSideComponent('login')
              this.$notify({
                type: 'error',
                title: 'Sessão',
                text: 'Sessão encerrada'
              })
            } else {
              this.$notify({
                type: 'error',
                title: 'Error',
                text: err.message.replace('GraphQL error: ', '')
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
