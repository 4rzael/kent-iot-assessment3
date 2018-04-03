<template>
  <div style="margin-left: 25px">
    <h1>Devices Overview</h1>
    <p style="font-size: larger">This page is dedicated for the engineers and ...</p>
    <div class="row">
          <b-card :header="'<i class=\'fa fa-microchip pull-left nomargin\'></i>' + dev"
                    header-tag="header"
                    v-for="dev in devices" :key="dev">
                <device :deviceId="dev"></device>
            </b-card>
    </div>
  </div>
</template>

<script>
  import device from "@/components/Device"
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  export default {
    name: 'OverviewPage',
    computed: {
      devices () {
        return this.$store.state.api.devices
      }
    },
    mounted () {
      this.$store.dispatch('retrieveDevices')
    },
    components: {
      'device': device
    }
  }
</script>

<style>
  .card {
    margin: 5px;
  }
  .card:hover {
    background-color: #ececec;
  }
  .card .card-header {
    background-color: #ececec;
  }

  .card .card-title {
    margin: 5px;
    margin-top: 0px;
  }
</style>
