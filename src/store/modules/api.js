import * as types from '../mutation-types'
import axios from 'axios'
import Vue from 'vue'

import cache from '../../utils/cache'

import * as measurementRates from '../../utils/measurementRates'

const state = {
  sites: [],
  devices: [],
  preciseDevices: {},
  measurements: {} // {DEVICE_ID: {MEASUREMENT_TYPE: [{date: Date, value: float, min: float, max: float}]}}
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
        deviceIds.forEach(deviceId => apiStore.dispatch('retrievePreciseDevice', deviceId))
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
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
