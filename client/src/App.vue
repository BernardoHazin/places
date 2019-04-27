<template>
  <div id="app">
    <v-app>
      <notifications
        :classes="'notification'"
        color="red"
        position="top center"
        :duration="6000"
      />
      <v-toolbar>
        <img alt="Places logo" class="logo-img" src="./assets/logo.png" />
        <v-toolbar-title class="hidden-sm-and-down">Places</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="setSideComponent('login')">Entrar</v-btn>
          <v-btn flat @click="setSideComponent('register')">Cadastrar-se</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <router-view />
    </v-app>
  </div>
</template>

<script>
import { setSideComponent } from '@/mixins'

export default {
  mixins: [setSideComponent],
  mounted() {
    this.$notify('Test')
  }
}
</script>


<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center

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
