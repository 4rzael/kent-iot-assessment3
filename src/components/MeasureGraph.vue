<template>
  <div>
    {{measurementType}}
    <chart :type="'line'" :data="graphData" :options="options"></chart>
  </div>
</template>
<script>
import * as measurementRates from '../utils/measurementRates'
import graphColors from '../utils/graphColors'
import Chart from './Chartjs.vue'

export default {
  name: 'measure-graph',
  props: ['measurementType', 'devicesIds', 'greenhouseId'],
  computed: {
    devices () {
      this.retrieveMeasurements()
      return this.devicesIds
    },

    limits () {
      if (this.$store.state.api.greenhousesLimits[this.greenhouseId]) {
        return this.$store.state.api.greenhousesLimits[this.greenhouseId][this.measurementType]
      } else {
        return undefined
      }
    },

    annotations () {
      if (!this.limits) {
        return undefined
      } else {
        return {
          events: ['click'],
          annotations: [
            {
              drawTime: 'beforeDatasetsDraw',
              id: 'min',
              type: 'box',
              yScaleID: 'y-axis-0',
              yMax: this.limits.min,
              backgroundColor: '#FF000020'
            },
            {
              drawTime: 'beforeDatasetsDraw',
              id: 'max',
              type: 'box',
              yScaleID: 'y-axis-0',
              yMin: this.limits.max,
              backgroundColor: '#FF000020'
            },
            {
              drawTime: 'beforeDatasetsDraw',
              id: 'great',
              type: 'box',
              yScaleID: 'y-axis-0',
              yMin: this.limits.min,
              yMax: this.limits.max,
              backgroundColor: '#00FF0020'
            }
          ]
        }
      }
    },

    values () {
      return this.devices.map(dId =>
        this.$store.getters.getMeasurements(
          dId,
          this.measurementType,
          measurementRates.MEASUREMENT_HOURS
        )
      )
    },
    datasets () {
      return this.values.map((vals, idx) => ({
        label: this.devicesIds[idx],
        data: vals ? vals.map(v => (v ? {
          x: v.time,
          y: v.value} : undefined)) : [],
        borderColor: graphColors[idx],
        fill: false
      }))
        .filter(v => v.data.length > 0)
    },
    graphData () {
      return {
        labels: [],
        datasets: this.datasets
      }
    },
    nbDevices () {
      return this.datasets.length
    },
    options () {
      return {
        scales: {
          xAxes: [{
            type: 'time'
          }]
        },
        annotation: this.annotations
      }
    }
  },
  methods: {
    retrieveMeasurements () {
      return this.devicesIds.map(deviceId =>
        this.$store.dispatch('retrieveMeasurements', {
          deviceId,
          measurementType: this.measurementType,
          measurementRate: measurementRates.MEASUREMENT_HOURS
        })
      )
    }
  },
  mounted () {
    this.$store.dispatch('retrieveDevices')
  },
  components: {
    Chart
  }
}
</script>
