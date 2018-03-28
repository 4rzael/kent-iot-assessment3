<template>
  <div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i class="fa fa-battery pull-left nomargin" :style="batteryStyle"></i>
        Battery: {{currentBattery}}%
      </p>
    </div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i class="fa fa-exclamation-circle pull-left nomargin" :style="errorsStyle"></i>
        Errors: {{errorsCount}}
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
    data: () => ({
      batteryColor (value) {
        if (value >= 95) {
          return 'green'
        } else if (value > 15) {
          return 'orange'
        } else {
          return 'red'
        }
      },
      errorsColor(value) {
        return (value > 0) ? 'red' : 'green'
      },
        errorsCount: 12
    }),
    computed: {
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
      errorsStyle () {
        return 'color:' + this.errorsColor(this.errorsCount) + ';'
      }
    },
    mounted () {
        this.$store.dispatch('retrieveLastMeasurement', {
          deviceId: this.deviceId,
          measurementType: measurementTypes.MEASUREMENT_BATTERY
        })
      }
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
