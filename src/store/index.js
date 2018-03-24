import Vue from 'vue'
import Vuex from 'vuex'
import {cachePlugin} from '../utils/cache'
import * as types from './mutation-types'

import api from './modules/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [cachePlugin],
  modules: {
    api
  }
})

export default store
