import Vue from 'vue'
import VueRouter from 'vue-router'

import BootstrapVue from 'bootstrap-vue'

import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import { sync } from 'vuex-router-sync'

// Vuex store
import store from './store/index'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

import VueNotify from 'vue-notifyjs'
import 'vue-notifyjs/themes/default.css'

// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
Vue.use(VueNotify)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

sync(store, router) // done. Returns an unsync callback fn

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
