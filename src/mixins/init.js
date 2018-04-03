import * as measurementTypes from '../utils/measurementTypes'
import * as measurementRates from '../utils/measurementRates'
import * as types from '../store/mutation-types'

import { CLEAR_KEY } from '../store/plugins/cache'

export const initMixin = {
  methods: {
    clearCache: function () {
      this.$store.commit(CLEAR_KEY, 'retrieveSites')
      this.$store.commit(CLEAR_KEY, 'retrieveDevices')
      this.$store.commit(CLEAR_KEY, 'retrieveMeasurements')
      this.$store.commit(CLEAR_KEY, 'retrieveLastMeasurement')
    },
    loadEverything: async function () {
      // get devices and stores
      await Promise.all([
        this.$store.dispatch('retrieveSites'),
        this.$store.dispatch('retrieveDevices')
      ])

      // then all measurements and battery levels
      await Promise.all(
        Object.values(this.$store.state.api.preciseDevices)
        .map(device => Promise.all(
          // get measurements
          device.measures
          .filter(m => m !== measurementTypes.MEASUREMENT_BATTERY)
          .map(m => this.$store.dispatch('retrieveMeasurements', {
            deviceId: device.id,
            measurementType: m,
            measurementRate: measurementRates.MEASUREMENT_HOURS
          }))
          .concat(
            // get battery levels
            this.$store.dispatch('retrieveLastMeasurement', {
              deviceId: device.id,
              measurementType: measurementTypes.MEASUREMENT_BATTERY
            })
          ))
        )
      )
    }
  },
  mounted: async function () {
    // handle toasting the notifications
    this.$store.subscribe(({type, payload}) => {
      if (type === types.ADD_NOTIFICATION) {
        const notif = payload
        this.$notify(notif)
      }
    })

    this.loadEverything()

    // every 10 minutes, reload data
    setInterval(() => {
      this.clearCache()
      this.loadEverything()
    }, 1000 * 60 * 10)
  }
}

export default initMixin
