import * as types from '../mutation-types'
import axios from 'axios'
import Vue from 'vue'

import cache from '../../utils/cache'

import * as measurementRates from '../../utils/measurementRates'
import * as measurementTypes from '../../utils/measurementTypes'

const state = {
  notifications: []
}

const mutations = {
  [types.SET_NOTIFICATIONS] (apiState, notifications) {
    Vue.set(apiState, 'notifications', notifications)
  },
  [types.ADD_NOTIFICATION] (apiState, notification) {
    apiState.notifications.push(notification)
  },
  [types.EDIT_NOTIFICATION] (apiState, notification) {
    const idx = apiState.notifications.findIndex(n => n._id === notification._id)
    if (idx >= 0) {
      Vue.set(apiState.notifications, idx, notification)
    }
  },
  [types.DELETE_NOTIFICATION] (apiState, notification) {
    const idx = apiState.notifications.findIndex(n => n._id === notification._id)
    if (idx >= 0) {
      apiState.notifications.splice(idx, 1)
    }
  }
}

const actions = {
  retrieveNotifications: cache('retrieveNotifications',
    async function (apiStore) {
      const res = await axios.get('http://localhost:3000')
      const notifs = res.data
      if (notifs !== undefined) {
        apiStore.commit(types.SET_NOTIFICATIONS, notifs)
      } else {
        console.error('Error while getting notifications', res)
      }
    }
  ),
  readNotification: async function (apiStore, notif) {
    const res = await axios.put(`http://localhost:3000/${notif._id}/read`)
    const updatedNotif = res.data
    if (updatedNotif !== undefined) {
      apiStore.commit(types.EDIT_NOTIFICATION, updatedNotif)
    } else {
      console.error('Error while reading notification', res)
    }
  },
  deleteNotification: async function (apiStore, notif) {
    const res = await axios.delete(`http://localhost:3000/${notif._id}`)
    apiStore.commit(types.DELETE_NOTIFICATION, notif)
  }

}

const getters = {
}

export default {
  state,
  mutations,
  actions,
  getters
}
