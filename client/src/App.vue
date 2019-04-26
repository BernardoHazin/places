<template>
  <div id="app">
    <v-app>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <img alt="Places logo" class="logo-img" src="./assets/logo.png">
        <v-toolbar-title>Places</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>Link One</v-btn>
          <v-btn flat>Link Two</v-btn>
          <v-btn flat>Link Three</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div> -->
      <router-view />
    </v-app>
  </div>
</template>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

.logo-img
  border-radius 50%
  width 35px

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
