<template>
  <v-layout
    v-resize="onResize"
    :column="isMobile || x < 800"
    class="home pa-2 fph"
  >
    <v-flex xs8 class="red">
      <GmapMap :center="position" :zoom="15" style="width: 100%; height: 100%;">
        <GmapMarker
          v-for="(m, index) in places"
          :key="index"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="position = m.position"
        />
        <direction />
      </GmapMap>
    </v-flex>
    <v-flex xs4 class="elevation-4">
      <transition name="fade" mode="out-in">
        <search
          key="1"
          v-if="$store.state.sideComponent === 'search'"
          :places="places.filter(el => el.name)"
          :searchLoading="searchLoading"
          @search="getPlace"
          @setPlace="setPlace"
        ></search>
        <login
          key="2"
          v-else-if="$store.state.sideComponent === 'login'"
        ></login>
        <register
          key="3"
          v-else-if="$store.state.sideComponent === 'register'"
        ></register>
      </transition>
    </v-flex>
  </v-layout>
</template>

<script>
import login from '../components/login'
import register from '../components/register'
import search from '../components/search'
import direction from '@/direction'
import gql from 'graphql-tag'

export default {
  name: 'home',
  computed: {
    isMobile() {
      return navigator.userAgent.includes('Mobile')
    }
  },
  components: {
    login,
    register,
    search,
    direction
  },
  data() {
    return {
      position: {
        lat: 0,
        lng: 0
      },
      x: window.innerWidth,
      places: [],
      selectedComponent: 'search',
      searchLoading: false
    }
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setUserPosition)
    }
  },
  methods: {
    onResize() {
      this.x = window.innerWidth
    },
    setPlace(val) {
      console.log(val)
      this.position = val
    },
    setUserPosition(position) {
      this.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      console.log(this.position)
      this.places.push({
        position: this.position
      })
    },
    getPlace(searchPlace) {
      this.searchLoading = true
      this.$apollo
        .query({
          query: gql`
            query getPlace($place: String!, $lat: Float, $lng: Float) {
              getPlace(place: $place, lat: $lat, lng: $lng) {
                id
                icon
                name
                rating
                isOpen
                lat
                lng
              }
            }
          `,
          variables: {
            place: searchPlace,
            lat: this.position.lat,
            lng: this.position.lng
          }
        })
        .then(({ data }) => {
          console.log('Result!', data)
          if (data.getPlace.length > 0) {
            this.places = data.getPlace.map(el => ({
              position: {
                lat: el.lat,
                lng: el.lng
              },
              name: el.name
            }))
            this.position = this.places[0].position
          }
        })
        .catch(err => {
          console.log('Err', err.message)
        })
        .finally(() => {
          this.searchLoading = false
        })
    }
  }
}
</script>
