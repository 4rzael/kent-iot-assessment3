import Vue from 'vue'

export const START_CACHE = 'VUE_CACHE_ACTION_START_CACHE'
export const CACHE = 'VUE_CACHE_ACTION_CACHE'
export const CLEAR = 'VUE_CACHE_ACTION_CLEAR'
export const CLEAR_KEY = 'VUE_CACHE_ACTION_CLEAR_KEY'
export const CLEAR_ALL = 'VUE_CACHE_ACTION_CLEAR_ALL'
export const MODULE_NAME = '__vueCacheAction'

export const CACHED_TRUE = true
export const CACHED_FALSE = false
export const CACHED_PENDING = 'CACHED_PENDING'

const hash = require('node-object-hash')().sort

function checkUnknownKey (state, key, action) {
  if (state.cached[key] === undefined) {
    console.warn('Trying to', action, 'the cache of an unknown key:', key)
    Vue.set(state.cached, key, {})
  }
}

function createParamsIfNecessary (state, key, params) {
  if (state.cached[key][hash(params)] === undefined) {
    Vue.set(state.cached[key], hash(params), {cachingStatus: false, value: undefined, cachingPromise: undefined})
  }
}

function cacheKeyWithParams (state, {key, params, value: toCache}) {
  checkUnknownKey(state, key, 'populate')
  createParamsIfNecessary(state, key, params)

  if (state.cached[key][hash(params)].cachingStatus === CACHED_TRUE) {
    console.warn('Caching a value while already cached, on key', key, 'and value', toCache)
  }
  Vue.set(state.cached[key][hash(params)], 'value', toCache)
  state.cached[key][hash(params)].cachingStatus = CACHED_TRUE
  state.cached[key][hash(params)].cachingPromise = undefined
}

function clearKeyWithParams (state, {key, params}) {
  checkUnknownKey(state, key, 'clear')
  createParamsIfNecessary(state, key, params)
  state.cached[key][hash(params)].cachingStatus = CACHED_FALSE
  state.cached[key][hash(params)].cachingPromise = undefined
}

function clearKey (state, key) {
  checkUnknownKey(state, key, 'populate')
  Object.keys(state.cached[key]).forEach(params => {
    state.cached[key][hash(params)].cachingStatus = CACHED_FALSE
    state.cached[key][hash(params)].cachingPromise = undefined
  })
}

function clearAll (state) {
  Object.keys(state.cached).forEach(key => {
    Object.keys(state.cached[key]).forEach(params => {
      state.cached[key][hash(params)].cachingStatus = CACHED_FALSE
      state.cached[key][hash(params)].cachingPromise = undefined
    })
  })
}

function makeCachePending (state, {key, params, promise}) {
  checkUnknownKey(state, key, 'preparing')
  createParamsIfNecessary(state, key, params)

  if (state.cached[key][hash(params)].cachingStatus !== CACHED_FALSE) {
    console.warn('Preparing to cache while already cached or caching, on key', key)
  }
  state.cached[key][hash(params)].cachingStatus = CACHED_PENDING
  state.cached[key][hash(params)].cachingPromise = promise
}

const module = {
  state: {
    cached: {}
  },
  mutations: {
    [START_CACHE]: makeCachePending,
    [CACHE]: cacheKeyWithParams,
    [CLEAR]: clearKeyWithParams,
    [CLEAR_KEY]: clearKey,
    [CLEAR_ALL]: clearAll
  }
}

export default function cacheDecorator (cacheKey, callback) {
  module.state.cached[cacheKey] = {}
  return async (context, params) => {
    const state = context.rootState || context.state
    // already cached => send the value
    if (state[MODULE_NAME].cached[cacheKey] !== undefined &&
        state[MODULE_NAME].cached[cacheKey][hash(params)] !== undefined &&
        state[MODULE_NAME].cached[cacheKey][hash(params)].cachingStatus === CACHED_TRUE) {
      return state[MODULE_NAME].cached[cacheKey].value
    // already caching => wait for the value
    } else if (state[MODULE_NAME].cached[cacheKey] !== undefined &&
        state[MODULE_NAME].cached[cacheKey][hash(params)] !== undefined &&
        state[MODULE_NAME].cached[cacheKey][hash(params)].cachingStatus === CACHED_PENDING) {
      if (state[MODULE_NAME].cached[cacheKey][hash(params)].cachingPromise !== undefined) {
        return state[MODULE_NAME].cached[cacheKey][hash(params)].cachingPromise
      } else {
        return undefined
      }
    // not cached => lock, execute, and cache
    } else {
      const promise = callback(context, params)
      context.commit(START_CACHE, {key: cacheKey, params, promise})
      const res = await promise
      context.commit(CACHE, {key: cacheKey, params, value: res})
      return res
    }
  }
}

export function cachePlugin (store) {
  store.registerModule(MODULE_NAME, module)
}
