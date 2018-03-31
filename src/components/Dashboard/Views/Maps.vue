<template>
  <gmap-map
    id="map"
    :center="center"
    :zoom="15"
    map-type-id="satellite">
    <gmap-marker
        v-for="marker in mapMarkers"
        :key="marker.name"
        :position="marker.position"
        :draggable="false"
        :label="marker.name">
    </gmap-marker>
  </gmap-map>
</template>
<script>
  import {API_KEY} from './Maps/API_KEY'
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import device from "@/components/Device"
  export const THANET_EARTH_LAT = 51.309064
  export const THANET_EARTH_LON = 1.101947

  Vue.use(VueGoogleMaps, {
    load: {
      key: API_KEY
    }
  })
  export default {
    computed: {
      sites () {
        console.log("Devices from store:", this.$store.state.api.sites);
        return this.$store.state.api.sites
      },
      mapMarkers () {
       return this.sites.map(site => ({name: site.id, position: {lat: site.lat, lng: site.lon}}))
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
        options: {
          styles: [{
            'featureType': 'water',
            'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.fill',
            'stylers': [{'hue': '#ff0000'}, {'saturation': -100}, {'lightness': 99}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{'color': '#808080'}, {'lightness': 54}]
          }, {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ece2d9'}]
          }, {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ccdca1'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [{'color': '#767676'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.stroke',
            'stylers': [{'color': '#ffffff'}]
          }, {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]}, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry.fill',
            'stylers': [{'visibility': 'on'}, {'color': '#b8cb93'}]
          }, {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.sports_complex',
            'stylers': [{'visibility': 'on'}]
          }, {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.business',
            'stylers': [{'visibility': 'simplified'}]
          }]
        }
      }
    }
  }
</script>
<style>
  #map {
    min-height: calc(100vh - 123px);
  }
</style>
