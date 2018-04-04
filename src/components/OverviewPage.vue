<template>
  <div style="margin-left: 25px">
    <h1>Devices Overview</h1>
    <p style="font-size: larger">
      This part is dedicated for the engineers.
      The engineers of Thanet Earth can consult the "engineer" page to have an
      overview of the health of the devices. On this page, all the devices are
      displayed alongside with the sensors and the numbers of errors if there are any.
      If our system detects any anomalies on the sensors, it will display them on
      this page with the number of anomalies it detected for each sensor.
    </p>
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
