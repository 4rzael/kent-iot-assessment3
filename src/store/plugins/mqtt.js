import Vue from 'vue'

export const MQTT_SERVER = 'ws://iot.4rzael.com:9001'
export const MQTT_EXPECTED_MESSAGE = '[+] Microcontroller finished: '

const module = {
  state: {
    messages: {} // {TOPIC: [String, String, String]}
  },
  mutations: {
    saveMessage (state, {topic, message}) {

      if (state.messages[topic] === undefined) {
        Vue.set(state.messages, topic, [])
      }
      // STORE IF message BEGINS WITH [+] Microcontroller finished...
      // if (message.toString().startsWith(MQTT_EXPECTED_MESSAGE)) {
        console.log(`[*] Saving '${message.toString()}' to store`);
        state.messages[topic].push(message.toString());
      // }
      // else {
      //   console.log("[*] Received '" + message.toString() + "' but not saving");
      // }
    }
  },
  actions: {
    receivedMessage (context, {topic, message}) {
      console.log(message)
      context.commit('saveMessage', {topic, message})
    }
  },
  getters: {
    getMessages (state) {
      return () => {
        return state.messages
      }
    }
  }
}

let client;

export const sendClient = function (topic, mesg, options) {
  client.publish(topic, mesg, options)
}

const toSubscribe = []
const subscribed = []
export const subscribe = function (topic) {
  if (!client) {
    toSubscribe.push(topic)
  } else if (subscribed.indexOf(topic) < 0) {
    console.log('Subscribing to the topic', topic)
    client.subscribe(topic)
    subscribed.push(topic)
  }
}

export const mqttPlugin = function (store) {
  const mqtt = require('mqtt')
  client = mqtt.connect(MQTT_SERVER);
  toSubscribe.forEach(topic => subscribe(topic))

  client.on('message', function (topic, message) {
    console.log(`[${topic}] Received '${message.toString()}'`)
    store.dispatch('receivedMessage', {topic, message})
  })
  store.registerModule('mqtt_plugin', module)
}

export default mqttPlugin
