<template>
  <div>
    <div class="tile is-ancestor" v-for="i in devicesLines + 1" :key="i">
      <div v-for="device in devicesAtLine(i-1)" :key="device" class="tile is-parent">
        <device :deviceId="device"></device>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Device from './Device.vue'

export default {
  name: 'device-list',
  computed: mapState({
    devices: store => store.api.devices,
    devicesLines: store => ~~(store.api.devices.length / 4)
  }),
  methods: {
    devicesAtLine (line) {
      const res = this.$store.state.api.devices.slice(line * 4, (line + 1) * 4)
      return res
    }
  },
  mounted () {
    this.$store.dispatch('retrieveDevices')
    this.$store.dispatch('retrieveSites')
  },
  components: {
    'device': Device
  }
}
</script>
