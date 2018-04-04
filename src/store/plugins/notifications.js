import * as types from '../mutation-types'
import axios from 'axios'
import Vue from 'vue'
import moment from 'moment'

import cache from '../plugins/cache'
import { subscribe } from '../plugins/mqtt'

const MODULE_NAME = 'notifications'
const API_HOST = 'http://iot.4rzael.com:3000'

const state = {
  notifications: []
}

const mutations = {
  [types.SET_NOTIFICATIONS] (apiState, notifications) {
    Vue.set(apiState, 'notifications', notifications)
    apiState.notifications.sort((a, b) => moment(b.date) - moment(a.date))
  },
  [types.ADD_NOTIFICATION] (apiState, notification) {
    apiState.notifications.push(notification)
    apiState.notifications.sort((a, b) => moment(b.date) - moment(a.date))
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
    async function (notifStore) {
      const res = await axios.get(API_HOST)
      const notifs = res.data
      if (notifs !== undefined) {
        notifStore.commit(types.SET_NOTIFICATIONS, notifs)
      } else {
        console.error('Error while getting notifications', res)
      }
    }
  ),
  readNotification: async function (notifStore, notif) {
    const res = await axios.put(`${API_HOST}/${notif._id}/read`)
    const updatedNotif = res.data
    if (updatedNotif !== undefined) {
      notifStore.commit(types.EDIT_NOTIFICATION, updatedNotif)
    } else {
      console.error('Error while reading notification', res)
    }
  },
  deleteNotification: async function (notifStore, notif) {
    await axios.delete(`${API_HOST}/${notif._id}`)
    notifStore.commit(types.DELETE_NOTIFICATION, notif)
  },
  postNotification: async function (notifStore, {message, date, type, category}) {
    const notif = {
      message,
      date: date || new Date(),
      type,
      category
    }

    await axios.post(API_HOST, notif)
  },
  addNotification: async function (notifStore, notif) {
    notifStore.commit(types.ADD_NOTIFICATION, notif)
  },
  blockNotifications: async function (notifStore, {category, date}) {
    await axios.put(`${API_HOST}/block_notifications`, {
      category,
      date: date || new Date()
    })
  }
}

const getters = {
}

const module = {
  state,
  mutations,
  actions,
  getters
}

export const notificationsPlugin = function (store) {
  store.registerModule(MODULE_NAME, module)
  subscribe('/notifications', {qos: 2})

  store.subscribe(({type, payload}) => {
    const {topic, message} = payload

    if (type === 'saveMessage' && topic === '/notifications') {
      const notif = JSON.parse(message.toString())

      store.dispatch('addNotification', notif)
    }
  })
}

export default notificationsPlugin
