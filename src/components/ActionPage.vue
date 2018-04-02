<template>
  <div style="margin-left: 25px">
    <h1>Actions</h1>
    <p>(TO DELETE) LAST MESSAGES: {{LastMessages}}</p>
    <div class="row" v-for="Section in actionsData">
    <b-card-group deck>
      <b-card v-for="element in  Section.actions"
              :key="element.name"
              :header="Section.section_name"
              header-tag="header"
              :img-src="element.values.url"
              img-alt="element.name"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2">
          <p class="card-text">
            {{element.values.msg}}
          </p>
        <b-button @click="sendMQTT(element.values.command)" variant="primary">
          {{element.name}}
        </b-button>
      </b-card>
    </b-card-group>
  </div>
</div>
</template>

<script>
  import {sendClient, subscribe} from '../store/plugins/mqtt'

  export const MQTT_TOPIC = 'presence42'

  export default {
    name: 'ActionPage',
    data() {
      return {
      actionsData: [{section_name: 'Temperature',
                          actions: [{
                                name: 'Heat up',
                                values: {msg: 'Heat up the place',
                                url: 'https://www.river1467.com.au/images/2017/11/FIREA.jpg',
                                command: 'temp_up'}
                            },
                            {
                                name: 'Cool down',
                                values: {msg: 'Cool down place',
                                url: 'https://in8life.com/wp-content/uploads/2016/07/three-ice-cubes.jpg',
                                command: 'temp_down'}
                              }],
                  },
                  {section_name: 'Nutriments',
                                      actions: [{
                                            name: 'Nutriments Up',
                                            values: {msg: 'Putting more nutriments to the plants',
                                            url: 'https://www.um.edu.mt/think/wp-content/uploads/2014/03/green-chemistry-glassware_shutterstock_80851456.jpg',
                                            command: 'nutriments_up'}
                                        },
                                        {
                                            name: 'Nutriments down',
                                            values: {msg: 'Nutriments down',
                                            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlx-wWUxq5umkxwNIrc7tAGxbNwM5HgRGCfsRWttcwp5U4Ivzy',
                                            command: 'nutriments_down'}
                                          }],
                              },

                    ]
      };
    },
    computed: {
      LastMessages () {
        const lastMessages = this.$store.getters.getMessages()
        return lastMessages
      }
    },
    methods: {
      sendMQTT (command_name) {
        console.log("[*] Sending to client '" + command_name + "' via mqtt");
        sendClient(MQTT_TOPIC, command_name);
      }
    },
    mounted() {
      subscribe(MQTT_TOPIC)
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

img {
  display: block;
  max-block-size: 50%;
  width: auto;
  height: auto;
}
</style>
