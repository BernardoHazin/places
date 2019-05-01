<template>
  <v-layout
    v-resize="onResize"
    :column="isMobile || x < 800"
    class="home pa-2 fph"
  >
    <!-- LEFT -->
    <v-flex xs8 class="red" style="min-height: 50vh;">
      <!-- GOOGLE MAPS COMPONENT -->
      <GmapMap :center="position" :zoom="15" style="width: 100%; height: 100%;">
        <!-- MAP MARKERS COMPONENTS -->
        <GmapMarker
          v-for="(m, index) in places"
          :key="index"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="clickMark(m)"
        />
      </GmapMap>
    </v-flex>
    <!-- RIGHT -->
    <v-flex xs4 class="elevation-4">
      <transition name="fade" mode="out-in">
        <!-- SEARCH COMPONENT -->
        <search
          key="1"
          v-if="$store.state.sideComponent === 'search'"
          :places="
            places.filter(el => el.name).length
              ? places.filter(el => el.name)
              : favorites
          "
          :searchLoading="searchLoading"
          @search="getPlace"
          @setPlace="setPlace"
          @info="getPlaceInfo"
        ></search>
        <!-- LOGIN COMPONENT -->
        <login
          key="2"
          v-else-if="$store.state.sideComponent === 'login'"
        ></login>
        <!-- REGISTER COMPONENT -->
        <register
          key="3"
          v-else-if="$store.state.sideComponent === 'register'"
        ></register>
      </transition>
    </v-flex>
    <!-- PLACE AVALIATIONS MODAL -->
    <v-dialog v-model="placeDialog" max-width="600px" scrollable>
      <v-card class="white">
        <v-card-title
          dark
          style="white-space: wrap;"
          class="title primary white--text"
        >
          <img width="20px" class="mr-2" :src="selectedPlace.icon" />
          {{ selectedPlace.name }}
          <v-spacer />
          <v-btn icon @click="closeDialog" dark>
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <!-- LOADING COMPONENT -->
        <v-progress-linear
          v-if="dialogLoading"
          :indeterminate="true"
        ></v-progress-linear>
        <!-- PLACE'S AVALIATION LIST -->
        <v-list three-line v-else-if="reviews.length">
          <v-list-tile avatar v-for="(review, i) in reviews" :key="i">
            <!-- AVALIATION'S USER PROFILE IMAGE -->
            <v-list-tile-avatar>
              <img :src="review.profileImg" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <!-- AVALIATION'S USER COMMENT -->
              <v-list-tile-title class="row ac">
                {{ review.comment }}
              </v-list-tile-title>
              <!-- AVALIATION'S PLACE RATING -->
              <v-rating
                v-model="review.rating"
                small
                color="primary"
                readonly
              ></v-rating>
              <!-- AVALIATION'S USER NAME -->
              <v-list-tile-sub-title>
                {{ review.name }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <!-- COMPONENT TO BE SHOWN WHEN NO AVALIATION HAVE BEEN FOUND -->
        <div v-else class="pa-4 fs-2">
          Nenhum review encontrado :/
        </div>
        <v-card-actions>
          <!-- CREATE AVALIATION FORM, ONLY SHOWN WHEN THE USER HAVE NOT EVALUATED YET -->
          <v-form ref="reviewForm" class="fpw col" v-if="email && !hasReviwed">
            <v-text-field v-model="comment" label="Comentário"></v-text-field>
            <div class="row">
              <v-rating v-model="rating" small></v-rating>
              <v-spacer />
              <v-btn
                @click="sendReview"
                color="primary"
                :disabled="dialogLoading || !comment || !rating"
              >
                Enviar
                <v-icon class="ml-3">fas fa-share</v-icon>
              </v-btn>
            </div>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import login from '../components/login'
import register from '../components/register'
import search from '../components/search'
import gql from 'graphql-tag'
import { mapState } from 'vuex'
import { logout, setSideComponent } from '@/mixins'

export default {
  mixins: [logout, setSideComponent],
  name: 'home',
  computed: {
    ...mapState(['email']),
    isMobile() {
      return navigator.userAgent.includes('Mobile')
    },
    hasReviwed() {
      return this.reviews.some(el => el.email === this.$store.state.email)
    },
    favorites() {
      return this.$store.state.favorites.map(el => ({
        id: el.placeId,
        name: el.placeName,
        icon: el.placeIcon
      }))
    }
  },
  components: {
    login,
    register,
    search
  },
  data() {
    return {
      position: {
        lat: 0,
        lng: 0
      },
      userPosition: {
        lat: 0,
        lng: 0
      },
      x: window.innerWidth,
      places: [],
      selectedComponent: 'search',
      selectedPlace: '',
      reviews: [],
      rating: 1,
      comment: '',
      searchLoading: false,
      placeDialog: false,
      dialogLoading: false
    }
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setUserPosition)
    }
  },
  apollo: {
    $subscribe: {
      avaliationAdded: {
        query: gql`
          subscription avaliationAdded {
            avaliationAdded {
              name
              email
              placeId
              profileImg
              rating
              comment
            }
          }
        `,
        result({ data }) {
          if (this.email && !this.hasReviwed) this.$refs.reviewForm.reset()
          if (
            this.selectedPlace &&
            data.avaliationAdded.some(
              el => el.placeId === this.selectedPlace.id
            )
          )
            this.reviews = data.avaliationAdded
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.placeDialog = false
      this.rating = 1
      if (this.email && !this.hasReviwed) this.$refs.reviewForm.reset()
    },
    onResize() {
      this.x = window.innerWidth
    },
    setPlace(val) {
      console.log(val)
      this.position = val
    },
    setUserPosition(position) {
      console.log(position)
      this.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.position = this.userPosition
      this.places.push({
        position: this.position
      })
    },
    clickMark(place) {
      this.position = place.position
      if (place.id) this.getPlaceInfo(place)
    },
    sendReview() {
      this.dialogLoading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation addAvaliation(
              $placeId: String!
              $userEmail: String!
              $rating: Int!
              $comment: String!
            ) {
              addAvaliation(
                placeId: $placeId
                userEmail: $userEmail
                rating: $rating
                comment: $comment
              )
            }
          `,
          variables: {
            placeId: this.selectedPlace.id,
            userEmail: this.$store.state.email,
            rating: this.rating,
            comment: this.comment
          }
        })
        .then(res => {
          console.log('Response', res)
        })
        .catch(err => {
          if (err.message === 'GraphQL error: Sessão inválida') {
            this.closeDialog()
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
          if (this.email && !this.hasReviwed) this.$refs.reviewForm.reset()
          this.dialogLoading = false
        })
    },
    getPlaceInfo(place) {
      this.dialogLoading = true
      this.$apollo
        .query({
          query: gql`
            query getAvaliations($placeId: String!) {
              getAvaliations(placeId: $placeId) {
                name
                email
                profileImg
                rating
                comment
              }
            }
          `,
          fetchPolicy: 'no-cache',
          variables: {
            placeId: place.id
          }
        })
        .then(({ data }) => {
          this.selectedPlace = place
          this.reviews = data.getAvaliations
          this.placeDialog = true
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: 'Error ao efetuar cadastro',
            text: err.message.replace('GraphQL error: ', '')
          })
        })
        .finally(() => {
          this.dialogLoading = false
        })
    },
    getPlace(searchPlace, radius) {
      if (!searchPlace) {
        this.places = []
        return
      }
      this.searchLoading = true
      this.$apollo
        .query({
          query: gql`
            query getPlace(
              $place: String!
              $radius: Int!
              $lat: Float
              $lng: Float
            ) {
              getPlace(place: $place, radius: $radius, lat: $lat, lng: $lng) {
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
            radius: radius,
            lat: this.userPosition.lat,
            lng: this.userPosition.lng
          }
        })
        .then(({ data }) => {
          console.log('Result!', data)
          if (data.getPlace.length > 0) {
            this.places = data.getPlace.map(el => ({
              id: el.id,
              position: {
                lat: el.lat,
                lng: el.lng
              },
              name: el.name,
              icon: el.icon,
              rating: Number(el.rating)
            }))
            this.position = this.places[0].position
          } else this.places = []
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
