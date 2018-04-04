<template>
  <div>
    <div v-for="gh of greenhouses" :key="gh.id">
      <greenhouse-page :greenhouse="gh"></greenhouse-page>
    </div>
  </div>
</template>

<script>
import GreenhousePage from './GreenhousePage.vue'
import { mapState } from 'vuex'

export default {
  name: 'greenhouses',
  computed: mapState({
    greenhouses: store => store.api.sites
  }),
  mounted () {
    this.$store.dispatch('retrieveSites')
  },
  components: {
    'greenhouse-page': GreenhousePage
  }
}
</script>
