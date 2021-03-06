<template>
  <div style="margin-left: 25px">
    <h1>Actions</h1>
    <p style="font-size: larger">
      This page is dedicated for the farmers to interact with their crops.
      A farmer should watch for any notifications produced by the system and act consequently.
      On this page, the farmer can click on the greenhouse in wich he want to take action upon
      and send the appropriate command to the connected microcontroller.
    </p>
    <div class="row">
      <card v-for="element in actionsData"
              :key="element.name">
        <div slot="header">
          <img class="img_style" style="float: left;" :src="element.values.url" :alt="element.name">
          <h4 style="float: right;">{{element.section_name}}</h4>
        </div>
        <action :element="element"></action>
        <div style="width: 100%;"  class="stats col-xs-12" slot="footer">
          <b-form-select style="max-width: 49%; cursor: pointer;" v-model="element.values.selected" :options="selectOptions" class="mb-3" />
          <b-button style="max-width: 49%; float: right; padding-bottom: 3px;" @click="sendMQTT(element.values.command, element.values.selected)" variant="primary" v-tooltip.bottom="'Send action \'' + element.name + '\''">
            {{element.name}}
          </b-button>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
  import {sendClient, subscribe, isMicrocontrollerFeedback} from '../store/plugins/mqtt'
  export const MQTT_TOPIC = 'presence42'
  import Action from '@/components/Action'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  // import VTooltip from 'v-tooltip'

  export default {
    name: 'ActionPage',
    components: {
      Card,
      Action
    },
    data: () => {
      return {
        selectOptions: [{
          text: 'Select site',
          value: null
        }],
        actionsData: [{
          section_name: 'Temperature',
          name: 'Heat up',
          values: {
            msg: 'This action will heat up the crops.',
            url: 'https://www.river1467.com.au/images/2017/11/FIREA.jpg',
            command: 'temp_up',
            selected: null
          }
        },
        {
          section_name: 'Temperature',
          name: 'Cool down',
          values: {
            msg: 'This action will cool down the crops.',
            url: 'https://in8life.com/wp-content/uploads/2016/07/three-ice-cubes.jpg',
            command: 'temp_down',
            selected: null
          }
        },
        {
          section_name: 'Nutriments',
          name: 'Nutriments up',
          values: {
            msg: 'This action adds some nutriments to the plant. It is essential to feed the plant whenever a notification is saying so.',
            url: 'https://www.um.edu.mt/think/wp-content/uploads/2014/03/green-chemistry-glassware_shutterstock_80851456.jpg',
            command: 'nutriments_up',
            selected: null
          }
        },
        {
          section_name: 'Nutriments',
          name: 'Nutriments down',
          values: {
            msg: 'An action that reduces the nutriments of the plant.',
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlx-wWUxq5umkxwNIrc7tAGxbNwM5HgRGCfsRWttcwp5U4Ivzy',
            command: 'nutriments_down',
            selected: null
          }
        },
        {
          section_name: 'Watering',
          name: 'Water plants',
          values: {
            msg: 'This action waters the plant. Watering the plants is important!',
            url: 'https://image.freepik.com/free-photo/water-background-with-splashes_23-2147608335.jpg',
            command: 'water_plants',
            selected: null
          }
        }]
      }
    },
    computed: {
      LastMessages () {
        return this.$store.getters.getMessages()
      },
      devices () {
        return this.$store.state.api.devices.map((device, index) => ({
          value: index,
          text: device
        }))
      }
    },
    mounted: async function () {
      await this.$store.dispatch('retrieveDevices')
      this.selectOptions = this.selectOptions.concat(this.devices)
      subscribe(MQTT_TOPIC)

      this.$store.subscribe(({type, payload}) => {
        const {topic, message} = payload

        if (type === 'saveMessage' && topic === MQTT_TOPIC && isMicrocontrollerFeedback(message)) {
          const [msg, actionId] = message.toString().split('::')
          this.$store.dispatch('postNotification', {
            message: msg,
            date: new Date(),
            type: 'success',
            category: 'sensors',
            hash: `action_${actionId}`
          })
        }
      })
    },
    methods: {
      notifyMesg (mesg, type) {
        const notification = {
          template: `<h6>[*] Sending '${mesg}' to microcontroller</h6>`
        }
        this.$notify(
          {
            component: notification,
            icon: 'fa fa-exchange',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type
          }
        )
      },
      sendMQTT (commandName, selectedItem) {
        if (selectedItem != null) {
          console.log('selectedItem:', selectedItem)
          console.log('this.selectOptions:', this.selectOptions[selectedItem + 1].value)
          console.log('this.selectOptions:', this.selectOptions[selectedItem + 1].text)
          const greenhouse = this.selectOptions[selectedItem + 1].text
          console.log(`[*] Sending to client '${commandName}' to '${greenhouse}' via mqtt`)
          const cmd = `${commandName}::${greenhouse}`
          this.notifyMesg(cmd, 'info')
          sendClient(MQTT_TOPIC, cmd)
        }
      }
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

  .card .card-footer {
    padding-left: 5px;
    padding-right: 5px
  }

  .card .card-title {
    margin: 5px;
    margin-top: 0px;
  }

  button {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .img_style {
    float: left;
    margin-bottom: 15px;
    display: block;
    max-block-size: 50%;
    width: auto;
    height: 80px;
  }
</style>
