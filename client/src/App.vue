<template>
  <div id="app">
    <v-app>
      <!-- NOTIFICATION COMPONENT -->
      <notifications
        :classes="'notification'"
        color="red"
        position="top center"
        :duration="6000"
      />
      <v-toolbar>
        <!-- NAVBAR LOGO -->
        <img
          style="cursor: pointer;"
          @click="$router.push({ name: 'home' })"
          alt="Places logo"
          class="logo-img"
          src="./assets/logo.png"
        />
        <!-- NAVBAR TITLE -->
        <v-toolbar-title class="hidden-sm-and-down">
          Places <span v-if="email">- {{ name }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- NAVBAR OPTIONS -->
        <v-toolbar-items class="row ac">
          <v-btn v-if="!email" flat @click="setSideComponent('login')"
            >Entrar</v-btn
          >
          <v-btn v-if="!email" flat @click="setSideComponent('register')"
            >Cadastrar-se</v-btn
          >
          <v-btn v-if="email" flat @click="openProfile">Perfil</v-btn>
          <v-btn v-if="email" flat @click="logout">Sair</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- USER PROFILE MODAL -->
      <v-dialog v-model="profileDialog" max-width="600px" persistent>
        <profile
          :email="email"
          :name="name"
          :profileImg="profileImg"
          @close="profileDialog = false"
        />
      </v-dialog>
      <!-- ROUTER INJECTION -->
      <router-view />
    </v-app>
  </div>
</template>

<script>
import { setSideComponent, logout } from '@/mixins'
import profile from './components/profile'
import { mapState } from 'vuex'
import gql from 'graphql-tag'

export default {
  mixins: [setSideComponent, logout],
  components: {
    profile
  },
  computed: {
    ...mapState(['email', 'name', 'profileImg'])
  },
  data() {
    return {
      profileDialog: false
    }
  },
  methods: {
    openProfile() {
      this.profileDialog = true
    }
  }
}
</script>


<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Poppins')

#app
  font-family 'Poppins', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center

.loginBtn
  box-sizing border-box
  position relative
  /* width: 13em;  - apply for fixed size */
  margin 0.2em
  padding 0 15px 0 46px
  border none
  text-align left
  line-height 34px
  white-space nowrap
  border-radius 0.2em
  font-size 16px
  color #FFF

.loginBtn:before
  content ''
  box-sizing border-box
  position absolute
  top 0
  left 0
  width 34px
  height 100%

.loginBtn:focus
  outline none

.loginBtn:active
  box-shadow inset 0 0 0 32px rgba(0, 0, 0, 0.1)

/* Facebook */
.loginBtn--facebook
  background-color #4C69BA
  background-image linear-gradient(#4C69BA, #3B55A0)
  /* font-family: "Helvetica neue", Helvetica Neue, Helvetica, Arial, sans-serif; */
  text-shadow 0 -1px 0 #354C8C

.loginBtn--facebook:before
  border-right #364e92 1px solid
  background url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_facebook.png') 6px 6px no-repeat

.loginBtn--facebook:hover, .loginBtn--facebook:focus
  background-color #5B7BD5
  background-image linear-gradient(#5B7BD5, #4864B1)

.notification
  padding 10px
  margin 10px
  font-size 14px
  color #ffffff
  background #44A4FC !important
  border-left 5px solid #187FE7

  &.warn
    background #ffb648
    border-left-color #f48a06

  &.error
    background #E54D42
    border-left-color #B82E24

  &.success
    background #68CD86
    border-left-color #42A85F

.logo-img
  border-radius 50%
  width 35px

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s

.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */
  opacity 0

::-webkit-scrollbar
  width 3px
  height 3px

::-webkit-scrollbar-track
  border-radius 10px
  background white

/* Handle */
::-webkit-scrollbar-thumb
  background #888
  border-radius 15px

::-webkit-scrollbar-thumb:hover
  cursor pointer

.tx-l
  text-align left

.tx-r
  text-align right

.tx-c
  text-align center

.scroll
  overflow-y scroll

.hide
  overflow hidden

.fixed
  position fixed

.absolute
  position absolute

.bold
  font-weight bold

.fs-1
  font-size 1em

.fs-2
  font-size 1.5em

.fs-3
  font-size 2em

.fs-4
  font-size 2.5em

.fs-5
  font-size 3em

.fs-6
  font-size 3.5em

.fs-7
  font-size 4em

.fpw
  width 100%

.fph
  height 100%

.fvh
  height 100vh

.fvw
  width 100vw

.row
  display flex
  flex-direction row

.col
  display flex
  flex-direction column

.fr
  float right

.fl
  float left

.wrap
  flex-wrap wrap
  white-space wrap

.ac
  align-items center

.jc
  justify-content center

.as
  align-items flex-start

.js
  justify-content flex-start

.ae
  align-items flex-end

.je
  justify-content flex-end

.sc
  align-self center
</style>
