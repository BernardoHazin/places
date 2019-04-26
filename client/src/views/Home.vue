<template>
  <div class="home pa-2 jc" :class="isMobile ? 'col' : 'row'">
    <GmapMap
      :center="position"
      :zoom="15"
      style="width: 500px; height: 300px"
    >
      <GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :position="m"
        :clickable="true"
        :draggable="true"
      />
    </GmapMap>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  computed: {
    isMobile() {
      return navigator.userAgent.includes('Mobile')
    }
  },
  data() {
    return {
      position: {
        lat: 0,
        lng: 0
      },
      markers: []
    }
  },
  components: {
    HelloWorld
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setUserPosition)
    } else {
      x.innerHTML = 'Geolocation is not supported by this browser.'
    }
  },
  methods: {
    setUserPosition(position) {
      this.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.markers.push(this.position)
    }
  }
}
</script>
