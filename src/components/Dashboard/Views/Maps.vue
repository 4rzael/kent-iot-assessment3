<template>
  <div class="row">
    <div class="col-md-6" style="margin-top: 10px; margin-left: 10px;">
      <gmap-map
        id="map"
        class="map-container"
        :center="center"
        :zoom="15"
        map-type-id="satellite">
        <gmap-marker
            v-for="marker in mapMarkers"
            :key="marker.name"
            :position="marker.position"
            :draggable="false"
            :clickable="true"
            @click="gotoGreenhouse(marker.id)"
            :label="marker.id"
            :title="marker.name">
        </gmap-marker>
      </gmap-map>
    </div>
    <weather style="width: 45%"></weather>
  </div>
</template>
<script>
  import {API_KEY} from './Maps/API_KEY'
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import Weather from '@/components/WeatherPage'
  export const THANET_EARTH_LAT = 51.309064
  export const THANET_EARTH_LON = 1.101947

  Vue.use(VueGoogleMaps, {
    load: {
      key: API_KEY
    }
  })
  export default {
    components: {
      Weather
    },
    methods: {
      gotoGreenhouse (greenhouse_id) {
        this.$router.push(`/greenhouses/${greenhouse_id}`)
      }
    },
    computed: {
      sites () {
        console.log("Devices from store:", this.$store.state.api.sites);
        return this.$store.state.api.sites
      },
      mapMarkers () {
       return this.sites.map(site => ({id: site.id, name: site.name, position: {lat: site.lat, lng: site.lon}}))
      }
    },
    mounted () {
      this.$store.dispatch('retrieveDevices')
    },
    data () {
      return {
        center: {
          lat: THANET_EARTH_LAT,
          lng: THANET_EARTH_LON
        },
    }
  }
}
</script>

<style>
  #map {
    min-height: calc(100vh - 123px);
  }
</style>
