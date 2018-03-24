<template>
  <div>
    {{greenhouse.name}}
    <div v-for="(graph, key) in graphs" :key="key">
      <measure-graph :measurementType="key" :devicesIds="graph"></measure-graph>
    </div>
  </div>
</template>

<script>
import MeasureGraph from './MeasureGraph.vue'
import * as measurementTypes from '../utils/measurementTypes'

export default {
  name: 'greenhouse-page',
  computed: {
    greenhouse () {
      return this.$store.state.api.sites
        .find(site => site.id === this.$store.state.route.params.id)
    },

    zoneIds () {
      return this.greenhouse !== undefined
        ? this.greenhouse.zones.map(z => z.id)
        : []
    },

    devices () {
      return Object.values(this.$store.state.api.preciseDevices)
        .filter(device => device.site === this.greenhouse.id)
        .filter(device => this.zoneIds.includes(device.zone))
    },

    graphs () {
      const res = {}
      Object.values(measurementTypes).forEach((type) => {
        if (type !== measurementTypes.MEASUREMENT_BATTERY) {
          res[type] = this.devices
            .filter(d => d.measures.includes(type))
            .map(d => d.id)
        }
      })
      return Object.assign({}, res)
    }
  },
  mounted () {
    this.$store.dispatch('retrieveSites')
    this.$store.dispatch('retrieveDevices')
  },
  components: {
    'measure-graph': MeasureGraph
  }
}
</script>
