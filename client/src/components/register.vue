<template>
  <div>
    <div class="row ac">
      <v-btn icon @click="setSideComponent('search')">
        <v-icon color="primary">fas fa-chevron-left</v-icon>
      </v-btn>
      <h3 class="fs-2 primary--text">Cadastrar-se</h3>
    </div>
  </div>
</template>

<script>
import { setSideComponent } from '@/mixins'

export default {
  mixins: [setSideComponent]
}
</script>

