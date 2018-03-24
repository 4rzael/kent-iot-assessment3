<template>
  <div>
    <article class="box is-child">
      <p class="title">{{deviceId}}</p>
      <p class="subtitle" :style="batteryStyle">battery: {{currentBattery}}</p>
      <peity :type="'bar'" :options="{ 'fill': batteryColor }" :data="graphData"></peity>
    </article>
  </div>
</template>

<script>
import * as measurementTypes from '../utils/measurementTypes'
import * as measurementRates from '../utils/measurementRates'
import Peity from 'vue-peity'

export default {
  name: 'device',
  props: ['deviceId'],
  components: {
    Peity
  },
  data: () => ({
    batteryColor (value) {
      if (value >= 95) {
        return 'green'
      } else if (value > 15) {
        return 'orange'
      } else {
        return 'red'
      }
    }
  }),
  computed: {
    batteryHistory () {
      return this.$store.getters.getMeasurements(
        this.deviceId,
        measurementTypes.MEASUREMENT_BATTERY,
        measurementRates.MEASUREMENT_DAYS)
    },
    currentBattery () {
      const lastBattery = this.$store.getters.getMeasurements(
        this.deviceId,
        measurementTypes.MEASUREMENT_BATTERY,
        measurementRates.MEASUREMENT_LAST)

      if (lastBattery !== undefined) {
        return lastBattery.value
      } else {
        return undefined
      }
    },
    batteryStyle () {
      return 'color:' + this.batteryColor(this.currentBattery) + ';'
    },
    graphData () {
      if (this.batteryHistory !== undefined) {
        return this.batteryHistory
          .map(v => v) // copies the array
          .sort((a, b) => a.time.getTime() - b.time.getTime())
          .map(v => v.value)
          .join(',')
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('retrieveMeasurements', {
      deviceId: this.deviceId,
      measurementType: measurementTypes.MEASUREMENT_BATTERY,
      measurementRate: measurementRates.MEASUREMENT_DAYS
    })
    this.$store.dispatch('retrieveLastMeasurement', {
      deviceId: this.deviceId,
      measurementType: measurementTypes.MEASUREMENT_BATTERY
    })
  }
}
</script>
