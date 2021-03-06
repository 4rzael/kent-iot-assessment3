import moment from 'moment'
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
      this.$store.commit(CLEAR_KEY, 'retrieveLastMeasurement')
      this.$store.commit(CLEAR_KEY, 'retrieveNotifications')
    },
    loadEverything: async function () {
      // get devices and stores
      await Promise.all([
        this.$store.dispatch('retrieveSites'),
        this.$store.dispatch('retrieveDevices'),
        this.$store.dispatch('retrieveNotifications')
      ])

      // then all measurements and battery levels
      // await Promise.all(
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
            }).then(async () => {
              const battery = this.$store.getters.getMeasurements(
                device.id,
                measurementTypes.MEASUREMENT_BATTERY,
                measurementRates.MEASUREMENT_LAST
              )
              const category = `devices/${device.id}/battery`

              if (battery.value < 25) {
                console.log('Battery level critical')
                await this.$store.dispatch('postNotification', {
                  message: `Device ${device.id}: ${battery.value}% battery left`,
                  date: moment(battery.time).toDate(),
                  type: 'danger',
                  category
                })
              }

              this.$store.dispatch('blockNotifications', {
                category,
                date: moment(battery.time).toDate()
              })
            })
          ))
          // )
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
