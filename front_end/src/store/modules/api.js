import * as types from '../mutation-types'
import axios from 'axios'
import Vue from 'vue'

import cache from '../plugins/cache'

import * as measurementRates from '../../utils/measurementRates'
import * as measurementTypes from '../../utils/measurementTypes'

const state = {
  sites: [],
  devices: [],
  preciseDevices: {},
  measurements: {}, // {DEVICE_ID: {MEASUREMENT_TYPE: [{date: Date, value: float, min: float, max: float}]}}
  unusualMeasurements: {},  // {DEVICE_ID: {MEASUREMENT_TYPE: [{date: Date, value: float, min: float, max: float}]}}
  greenhousesLimits: {
    gh1: {
      [measurementTypes.MEASUREMENT_TEMPERATURE]: {min: 18, max: 35},
      [measurementTypes.MEASUREMENT_NUTRIMENTS]: {min: 300, max: 700},
      [measurementTypes.MEASUREMENT_MOISTURE]: {min: 50, max: 75},
      [measurementTypes.MEASUREMENT_LUMINOSITY]: {min: 10000, max: 50000}
    },
    gh2: {
      [measurementTypes.MEASUREMENT_TEMPERATURE]: {min: 18, max: 27},
      [measurementTypes.MEASUREMENT_NUTRIMENTS]: {min: 280, max: 700},
      [measurementTypes.MEASUREMENT_MOISTURE]: {min: 30, max: 45},
      [measurementTypes.MEASUREMENT_LUMINOSITY]: {min: 10000, max: 50000}
    },
    gh3: {
      [measurementTypes.MEASUREMENT_TEMPERATURE]: {min: 15, max: 32},
      [measurementTypes.MEASUREMENT_MOISTURE]: {min: 40, max: 55},
      [measurementTypes.MEASUREMENT_LUMINOSITY]: {min: 10000, max: 50000}
    }
  }
}

const mutations = {
  [types.SET_SITES] (apiState, sites) {
    Vue.set(apiState, 'sites', sites)
  },
  [types.SET_DEVICES] (apiState, devices) {
    Vue.set(apiState, 'devices', devices)
  },
  [types.SET_MEASUREMENTS] (apiState, { deviceId, measurementType, measurementRate, measurements }) {
    if (apiState.measurements[deviceId] === undefined) {
      Vue.set(apiState.measurements, deviceId, {})
    }
    if (apiState.measurements[deviceId][measurementType] === undefined) {
      Vue.set(apiState.measurements[deviceId], measurementType, {})
    }
    Vue.set(apiState.measurements[deviceId][measurementType], measurementRate, measurements)
  },
  [types.SET_DEVICE] (apiState, { deviceId, device }) {
    Vue.set(apiState.preciseDevices, deviceId, device)
  },
  [types.SET_UNUSUAL_MEASUREMENTS] (apiState, { deviceId, measurementType, measurementRate, unusualMeasurements }) {
    if (apiState.unusualMeasurements[deviceId] === undefined) {
      Vue.set(apiState.unusualMeasurements, deviceId, {})
    }
    if (apiState.unusualMeasurements[deviceId][measurementType] === undefined) {
      Vue.set(apiState.unusualMeasurements[deviceId], measurementType, {})
    }
    Vue.set(apiState.unusualMeasurements[deviceId][measurementType], measurementRate, unusualMeasurements)
  }
}

const actions = {
  retrieveSites: cache('retrieveSites',
    async function (apiStore) {
      const res = await axios.get('http://shed.kent.ac.uk/sites')
      const sites = res.data
      if (sites !== undefined) {
        apiStore.commit(types.SET_SITES, sites)
      } else {
        console.error('Error while getting sites', res)
      }
    }
  ),

  retrieveDevices: cache('retrieveDevices',
    async function (apiStore) {
      const res = await axios.get('http://shed.kent.ac.uk/devices')
      const deviceIds = res.data
      if (deviceIds !== undefined) {
        apiStore.commit(types.SET_DEVICES, deviceIds)
        const promises = deviceIds.map(deviceId => apiStore.dispatch('retrievePreciseDevice', deviceId))
        await Promise.all(promises)
      } else {
        console.error('Error while getting devices', res)
      }
    }
  ),

  retrieveLastMeasurement: cache('retrieveLastMeasurement',
    async function (apiStore, {deviceId, measurementType}) {
      const res = await axios.get('http://shed.kent.ac.uk/device/' + deviceId + '/' + measurementType)
      if (res.data !== undefined) {
        const measurement = res.data

        apiStore.commit(types.SET_MEASUREMENTS, {
          deviceId,
          measurementType,
          measurementRate: measurementRates.MEASUREMENT_LAST,
          measurements: measurement
        })
      } else {
        console.error('Error while getting last measurement', res)
      }
    }
  ),

  retrieveMeasurements: cache('retrieveMeasurements',
    async function (apiStore, {deviceId, measurementType, measurementRate}) {
      if (measurementRate === undefined) {
        measurementRate = measurementRates.MEASUREMENT_HOURS
      }

      const res =
      await axios.get('http://shed.kent.ac.uk/device' +
                      '/' + deviceId +
                      '/' + measurementType +
                      '/' + measurementRate)
      if (res.data !== undefined) {
        const measurements = res.data
          .map(measurement => ({
            time: new Date(measurement.time),
            value: measurement.value || measurement.mean,
            min: measurement.min || measurement.value,
            max: measurement.max || measurement.value
          }))

        apiStore.commit(types.SET_MEASUREMENTS, {deviceId, measurementType, measurementRate, measurements})

        await Promise.all([
          updateUnusualMeasurements(apiStore, measurements, {deviceId, measurementType, measurementRate}),
          detectDangerousValues(apiStore, measurements, {deviceId, measurementType, measurementRate})
        ])
      } else {
        console.error('Error while getting measurements', res)
      }
    }
  ),

  retrievePreciseDevice: cache('retrievePreciseDevice',
    async function (apiStore, deviceId) {
      const res = await axios.get('http://shed.kent.ac.uk/device/' + deviceId)
      if (res.data !== undefined) {
        const device = res.data
        apiStore.commit(types.SET_DEVICE, {deviceId, device})
      } else {
        console.error('Error while getting sensor precise informations', res)
      }
    }
  )
}

async function updateUnusualMeasurements (apiStore, measurements, {deviceId, measurementType, measurementRate}) {
  const values = measurements.map(m => parseFloat(m.value))
  const add = (a, b) => a + b

  const sum = values.reduce(add, 0)
  const avg = sum / measurements.length

  const variance = values.map(v => Math.pow(v - avg, 2)).reduce(add, 0) / measurements.length
  const standardDeviation = Math.sqrt(variance)

  const minUsualValue = avg - (2 * standardDeviation)
  const maxUsualValue = avg + (2 * standardDeviation)

  const unusualMeasurements = measurements
    .filter(measurement => {
      const value = parseFloat(measurement.value)
      return (value < minUsualValue || value > maxUsualValue)
    })

  apiStore.commit(types.SET_UNUSUAL_MEASUREMENTS, {deviceId, measurementType, measurementRate, unusualMeasurements})
}

async function detectDangerousValues (apiStore, measurements, {deviceId, measurementType}) {
  // get greenhouse
  if (apiStore.state.preciseDevices[deviceId] === undefined) {
    await apiStore.dispatch('retrievePreciseDevice', deviceId)
  }
  const greenhouseId = apiStore.state.preciseDevices[deviceId].site
  const greenhouse = apiStore.state.sites.find(gh => gh.id === greenhouseId)

  // get limits
  if (greenhouse && apiStore.state.greenhousesLimits[greenhouseId] &&
      apiStore.state.greenhousesLimits[greenhouseId][measurementType]) {
    const limits = apiStore.state.greenhousesLimits[greenhouseId][measurementType]
    const isOk = (measurement) => ((measurement.value <= limits.max) && (measurement.value >= limits.min))

    // detect the OK/KO changes (fronts)
    const fronts = measurements.reduce((a, b) =>
      (a.length === 0 || (isOk(a[a.length - 1]) !== isOk(b)))
      ? a.concat(b)
      : a, []).filter(m => !isOk(m))

    console.log('fronts', deviceId, measurementType, fronts, 'limits', limits)

    const category = `${greenhouse.id}/${measurementType}`
    // make notifications from the OK->KO fronts
    await Promise.all(fronts.map(async (measurement) => {
      try {
        return await apiStore.dispatch('postNotification', {
          message: `${greenhouse.name}: ${measurementType}: Critical value (too ${measurement.value > limits.max ? 'high' : (measurement.value < limits.min ? 'low' : 'normal')})`,
          date: measurement.time,
          type: 'danger',
          category
        })
      } catch (e) {
        console.warn('Cannot post new notification:', e)
      }
    }))

    apiStore.dispatch('blockNotifications', {
      category,
      date: new Date()
    })
  }
}

const getters = {
  getMeasurements (state) {
    return (deviceId, measurementType, measurementRate) => {
      if (state.measurements[deviceId] === undefined) {
        return undefined
      } else if (state.measurements[deviceId][measurementType] === undefined) {
        return undefined
      } else {
        return state.measurements[deviceId][measurementType][measurementRate]
      }
    }
  },

  getUnusualMeasurements (state) {
    return (deviceId, measurementType, measurementRate) => {
      if (state.unusualMeasurements[deviceId] === undefined) {
        return undefined
      } else if (state.unusualMeasurements[deviceId][measurementType] === undefined) {
        return undefined
      } else {
        return state.unusualMeasurements[deviceId][measurementType][measurementRate]
      }
    }
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
