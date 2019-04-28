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
    <v-list class="transparent" two-line style="max-height: 60vh; overflow: auto;" dense>
      <v-list-tile
        v-for="(place, i) in places"
        :key="i"
        style="cursor: pointer;"
        @click.self="$emit('setPlace', place.position)"
      >
        <img width="20px" :src="place.icon" />
        <div class="ml-1">{{ place.name }}</div>
        <v-spacer />
        <v-rating
          v-model="place.rating"
          half-increments
          small
          readonly
        ></v-rating>
        <v-btn small icon @click.self="$emit('info')">
          <v-icon color="primary">fas fa-info-circle</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
    <v-dialog v-model="infoDialog"></v-dialog>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    places: [Object, Array],
    searchLoading: Boolean
  },
  data() {
    return {
      infoDialog: false,
      searchPlace: '',
      range: 10
    }
  },
  watch: {
    searchPlace: debounce(function(val) {
      if (val) this.$emit('search', val, this.range)
    }, 300),
    range: debounce(function(val) {
      if (this.searchPlace) this.$emit('search', this.searchPlace, val)
    }, 300)
  }
}
</script>
