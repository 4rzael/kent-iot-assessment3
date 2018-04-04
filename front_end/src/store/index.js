import Vue from 'vue'
import Vuex from 'vuex'
import {cachePlugin} from './plugins/cache'
import {mqttPlugin} from './plugins/mqtt'
import {notificationsPlugin} from './plugins/notifications'

import api from './modules/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [cachePlugin, mqttPlugin, notificationsPlugin],
  modules: {
    api
  }
})

export default store
