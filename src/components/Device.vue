<template>
  <div>
    <p class="card-text btn" style="cursor: default; border-bottom: 1px; border-bottom-style: solid;">
      <i class="fa fa-bell pull-left nomargin"></i>
      Unusual Values
    </p>
    <div>
      <p class="card-text btn" style="cursor: default;">
        <i :class="batteryIcon(currentBattery)" :style="batteryStyle(currentBattery)"></i>
          Battery: {{currentBattery}}%
      </p>
    </div>
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
        let finalColor = 'green';

        if (value > 110) {
          finalColor = 'red'
        } else if (value > 100) {
          finalColor = 'orange'
        } else if (value >= 95) {
          finalColor = 'green'
        } else if (value > 25) {
          finalColor = 'orange'
        } else {
          finalColor = 'red'
        }
        console.log("value:", value);
        console.log("finalColor:", finalColor);
        return 'color:' + finalColor + ';'
      },
      errorsStyle: function (value) {
        let finalColor = 'green';

        if (value > 2)
          finalColor = 'red'
        else if (value > 0)
          finalColor = 'orange'
        return 'color:' + finalColor + ';'
      },
      errorsIcon: function (value) {
        const positive = 'fa-check'
        const negative = 'fa-exclamation-circle'

        return 'fa ' + (value > 2 ? negative : positive) + ' pull-left nomargin'
      },
      batteryIcon: function (value) {
        let retVal = 'fa '

        if (value >= 110) {
          retVal += 'fa-cancel'
        }
        else if (value > 100) {
          retVal += 'fa-check'
        }
        else if (value >= 75) {
          retVal += 'fa-check'
        }
        else if (value >= 25) {
          retVal += 'fa-exclamation-circle'
        } else {
          retVal += 'fa-cancel'
        }
        return (retVal + ' pull-left nomargin')
      }
    },
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
