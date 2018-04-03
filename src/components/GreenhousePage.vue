<template>
  <div>
    <div style="text-align: center; font-size: 42px;">
      {{greenhouse.name}}
    </div>
    <div>
      <b-card-group deck style="margin: 10px">
        <b-card class="text-center" v-for="(graph, key, id) in graphs" :key="key" v-if="id % 2">
          <measure-graph :measurementType="key" :devicesIds="graph" :greenhouseId="greenhouse.id"></measure-graph>
        </b-card>
      </b-card-group>

      <b-card-group deck style="margin: 10px">
        <b-card class="text-center" v-for="(graph, key, id) in graphs" :key="key" v-if="!(id % 2)">
          <measure-graph :measurementType="key" :devicesIds="graph" :greenhouseId="greenhouse.id"></measure-graph>
        </b-card>
      </b-card-group>
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
      return ((this.greenhouse !== undefined)
        ? this.greenhouse.zones.map(z => z.id)
        : [])
    },

    devices () {
      return ((this.greenhouse !== undefined)
        ? Object.values(this.$store.state.api.preciseDevices)
          .filter(device => device.site === this.greenhouse.id)
          .filter(device => this.zoneIds.includes(device.zone))
        : [])
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
