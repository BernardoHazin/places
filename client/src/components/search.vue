<template>
  <div class="col">
    <v-text-field
      box
      v-model="searchPlace"
      :loading="searchLoading"
      :disabled="searchLoading"
      label="Procure um lugar!"
    ></v-text-field>
    <v-list class="transparent" style="max-height: 60vh; overflow: auto;" dense>
      <v-list-tile
        v-for="(place, i) in places"
        :key="i"
        style="cursor: pointer;"
        @click="$emit('setPlace', place.position)"
      >
        {{ place.name }}
      </v-list-tile>
    </v-list>
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
      searchPlace: ''
    }
  },
  watch: {
    searchPlace: debounce(function(val) {
      this.$emit('search', val)
    }, 300)
  }
}
</script>

