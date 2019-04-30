<template>
  <div class="col">
    <v-slider
      v-model="range"
      :label="`Raio ${range}km`"
      :max="50"
      class="pa-1"
    ></v-slider>
    <v-text-field
      box
      v-model="searchPlace"
      :loading="searchLoading"
      label="Procure um lugar!"
    ></v-text-field>
    <v-list
      class="transparent"
      two-line
      style="max-height: 60vh; overflow: auto;"
      dense
    >
      <v-list-tile
        v-for="(place, i) in places"
        :key="i"
        style="cursor: pointer;"
        @click.self="$emit('setPlace', place.position)"
      >
        <img width="20px" :src="place.icon" />
        <div class="ml-1">{{ place.name }}</div>
        <v-spacer />
        <v-btn small icon v-if="email" @click="favorite(place)">
          <v-icon color="primary">
            {{ favorites.some(el => el.placeId === place.id) ? 'fas' : 'far' }}
            fa-star
          </v-icon>
        </v-btn>
        <v-btn small icon @click="$emit('info', place)">
          <v-icon color="primary">fas fa-info-circle</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import gql from 'graphql-tag'
import { logout, setSideComponent } from '@/mixins'
import { mapState } from 'vuex'

export default {
  mixins: [logout, setSideComponent],
  props: {
    places: [Object, Array],
    searchLoading: Boolean
  },
  computed: {
    ...mapState(['email', 'favorites'])
  },
  data() {
    return {
      searchPlace: '',
      range: 10
    }
  },
  watch: {
    searchPlace: debounce(function(val) {
      this.$emit('search', val, this.range)
    }, 300),
    range: debounce(function(val) {
      if (this.searchPlace) this.$emit('search', this.searchPlace, val)
    }, 300)
  },
  methods: {
    favorite(place) {
      const ref = this.favorites.find(el => el.placeId === place.id)
      if (ref) {
        this.$store.dispatch('removeFavorite', this.favorites.indexOf(ref))
      } else {
        this.$store.dispatch('addFavorite', {
          placeId: place.id,
          placeName: place.name,
          placeIcon: place.icon
        })
      }
      this.$apollo
        .mutate({
          mutation: gql`
            mutation setFavorite(
              $placeId: String!
              $placeName: String!
              $placeIcon: String!
            ) {
              setFavorite(
                placeId: $placeId
                placeName: $placeName
                placeIcon: $placeIcon
              )
            }
          `,
          variables: {
            placeId: place.id,
            placeName: place.name,
            placeIcon: place.icon
          }
        })
        .catch(err => {
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
    }
  }
}
</script>
