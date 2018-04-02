import Vue from 'vue'

export const MQTT_SERVER = 'ws://iot.4rzael.com:9001'
export const MQTT_TOPIC = 'presence42'
export const MQTT_EXPECTED_MESSAGE = '[+] Microcontroller finished: '

const module = {
  state: {
    messages: []
  },
  mutations: {
    saveMessage (state, message) {
      if (message.toString().startsWith(MQTT_EXPECTED_MESSAGE)) {
        console.log("[*] Saving '" + message.toString() + "' to store");
        state.messages.push(message.toString());
      }
    }
  },
  actions: {
    receivedMessage (context, message) {
      console.log(message)
      context.commit('saveMessage', message)
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

export const sendClient = function (mesg) {
  client.publish(MQTT_TOPIC, mesg)
}

export const mqttPlugin = function (store) {
  const mqtt = require('mqtt')
  client = mqtt.connect(MQTT_SERVER);

  client.on('connect', function () {
    client.subscribe(MQTT_TOPIC)
  })

  client.on('message', function (topic, message) {
    console.log("[" + topic + "]Received '" + message.toString() + "'")
    store.dispatch('receivedMessage', message)
  })
  store.registerModule('mqtt_plugin', module)
}

export default mqttPlugin
