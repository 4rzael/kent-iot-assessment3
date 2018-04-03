<template>
  <div>
      <p class="card-text btn" style="cursor: default;">
        <i class="fa fa-battery pull-left nomargin" :style="batteryStyle(currentBattery)"></i>
        Battery: {{currentBattery}}%
      </p>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i :class="errorsIcon(unusualTemperatureMeasurement)" :style="errorsStyle(unusualTemperatureMeasurement)"></i>
        Temperature: {{unusualTemperatureMeasurement}}
      </p>
    </div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i :class="errorsIcon(unusualNutrimentsMeasurement)" :style="errorsStyle(unusualNutrimentsMeasurement)"></i>
        Nutriments: {{unusualNutrimentsMeasurement}}
      </p>
    </div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i :class="errorsIcon(unusualLuminosityMeasurement)" :style="errorsStyle(unusualLuminosityMeasurement)"></i>
        Luminosity: {{unusualLuminosityMeasurement}}
      </p>
    </div>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i :class="errorsIcon(unusualMoistureMeasurement)" :style="errorsStyle(unusualMoistureMeasurement)"></i>
        Moisture: {{unusualMoistureMeasurement}}
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
    methods: {
      batteryStyle: function (value) {
        let final_color = 'green';

        if (value >= 95) {
          final_color = 'green'
        } else if (value > 15) {
          final_color = 'orange'
        } else {
          final_color = 'red'
        }
        return 'color:' + final_color + ';'
      },
      errorsStyle: function (value) {
        let final_color = 'green';

        if (value > 2)
          final_color = 'red'
        else if (value > 0)
          final_color = 'orange'
        return 'color:' + final_color + ';'
      },
      errorsIcon: function (value) {
        const positive = 'fa-check'
        const negative = 'fa-exclamation-circle'
        return 'fa ' + (value > 2 ? negative : positive) + ' pull-left nomargin'
      },
    },
    data: () => ({
      batteryColor (value) {
      }
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
      unusualTemperatureMeasurement () {
        const errorTemperature = this.$store.getters.getUnusualMeasurements(
          this.deviceId,
          measurementTypes.MEASUREMENT_TEMPERATURE,
          measurementRates.MEASUREMENT_HOURS)
        if (errorTemperature !== undefined) {
          return errorTemperature.length
        } else {
        }
        return 0
      },
      unusualMoistureMeasurement () {
        const errorMoisture = this.$store.getters.getUnusualMeasurements(
          this.deviceId,
          measurementTypes.MEASUREMENT_MOISTURE,
          measurementRates.MEASUREMENT_HOURS)
        if (errorMoisture !== undefined) {
          return errorMoisture.length
        } else {
        }
        return 0
      },
      unusualNutrimentsMeasurement () {
        const errorNutriments = this.$store.getters.getUnusualMeasurements(
          this.deviceId,
          measurementTypes.MEASUREMENT_NUTRIMENTS,
          measurementRates.MEASUREMENT_HOURS)
        if (errorNutriments !== undefined) {
          return errorNutriments.length
        } else {
        }
        return 0
      },
      unusualLuminosityMeasurement () {
        const errorLuminosity = this.$store.getters.getUnusualMeasurements(
          this.deviceId,
          measurementTypes.MEASUREMENT_LUMINOSITY,
          measurementRates.MEASUREMENT_HOURS)
        if (errorLuminosity !== undefined) {
          return errorLuminosity.length
        } else {
        }
        return 0
      },
    },
    mounted () {
        this.$store.dispatch('retrieveLastMeasurement', {
          deviceId: this.deviceId,
          measurementType: measurementTypes.MEASUREMENT_BATTERY
        })
        // this.$store.dispatch('retrieveMeasurements', {
        //   deviceId: this.deviceId,
        //   measurementType: measurementTypes.MEASUREMENT_BATTERY
        // }),
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
