<template>
  <div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i class="fa fa-battery pull-left nomargin"></i>
        Battery: {{currentBattery}}%
      </p>
    </div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i class="fa fa-exclamation-circle pull-left nomargin"></i>
        Errors: {{errorcnt}}
      </p>
    </div>
  </div>
</template>

<script>
// child (here we props from father)
  import * as measurementTypes from '../utils/measurementTypes'
  import * as measurementRates from '../utils/measurementRates'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  export default {
    name: 'device',
    props: ['deviceId'],
    data () {
      return {
        msg: 'Hello from child',
        errorcnt: 2
      }
    },
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
          console.log("lastBattery", lastBattery)
        if (lastBattery !== undefined) {
          return lastBattery.value
        } else {
          return undefined
        }
      }
    },
    mounted () {
        // this.$store.dispatch('retrieveMeasurements', {
        //   deviceId: this.deviceId,
        //   measurementType: measurementTypes.MEASUREMENT_BATTERY,
        //   measurementRate: measurementRates.MEASUREMENT_DAYS
        // })
        console.log("hello", this);
        this.$store.dispatch('retrieveLastMeasurement', {
          deviceId: this.deviceId,
          measurementType: measurementTypes.MEASUREMENT_BATTERY
        })
      }
      // currentBattery () {
      //   return this.$store.getters.getMeasurements(this.deviceId)
      // }
}
</script>

<style>
  div.btn, p.btn {
      display: table;
      vertical-align: middle;
      border: none;
  }

  div.btn p, div.btn i {
    display: table-cell;
    vertical-align: middle;
  }
  div.btn i.icon.icon-2x.nomargin {
      margin-top: 0;
  }
</style>
