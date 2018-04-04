import mqtt from 'mqtt'

export let mqttClient

export const connect = function () {
  return new Promise((resolve, reject) => {
    mqttClient = mqtt.connect('mqtt://iot.4rzael.com:1883')

    mqttClient.on('connect', (...args) => {
      console.log('MQTT connected')
      resolve(...args)
    })
    mqttClient.on('disconnect', (...args) => {
      console.error('MQTT disconnected')
      reject(...args)
    })
    mqttClient.on('error', (...args) => {
      console.error('MQTT error', ...args)
    })
  })
}

export default connect
