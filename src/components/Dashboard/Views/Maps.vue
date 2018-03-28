<template>
  <div v-if="sitesFound">
    <gmap-map
      id="map"
      :center="center"
      :zoom="15"
      :options="options"
      map-type-id="satellite"
    >
    <gmap-marker
        v-for="m in toFix"
        :key="m.name"
        :position="m.position"
        :clickable="true"
        :draggable="true"
      ></gmap-marker>
      <!-- <gmap-marker :position="center">
      </gmap-marker> -->
    </gmap-map>
  </div>
</template>
<script>
  import {API_KEY} from './Maps/API_KEY'
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import device from "@/components/Device"

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
      toFix () {
        // return [{
        //   name: 'asd',
        //   position: {lat: 51.3552, lng: 1.287159}
        // }, {
        //   name: 'qwe',
        //   position: {lat: 51.355124, lng: 1.287159}
        // }]
       return this.sites.map(site => ({name: site.id, position: {lat: site.lat, lng: site.lon}}))
      },
      sitesFound() {
        return this.toFix.length > 0
      }
    },
    mounted () {
      this.$store.dispatch('retrieveDevices')
    },
    data () {
      return {
        center: {
          lat: 51.35520071504046,
          lng: 1.2871598865234546
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
