# IoT Assessment 3

This is the folder containing all of the code used for our submission.

You can find the website online at http://iot.4rzael.com

## Data Processing

### API retrieval/storage
* front_end/src/store/modules/api.js
  - Gives methods to retrieve data from the API
  - Stores the data in a [VueX](https://vuex.vuejs.org/en/intro.html) store for the components to use
* front_end/src/mixins/init.js
  - Perform the requests at the website startup
  - Updates the datas every 10 minutes

### Processing
* front_end/src/store/modules/api.js
  - Detects values out of the range
  - Detect unusual measurements that may indicate sensor failure
  - Detects critical battery levels

### Notifications
* back_end/routes/notifications.js
  - Stores notifications in a MongoDB database
  - Provide an API to interact with the notifications

* back_end/mqttConnection.js
  - Sends notifications in real time to the client

* front_end/src/store/plugins/notifications.js
  - Allows to retrieve and send notifications

### Actuator actions
* microcontroller/src/*
  - Retrieve actuator actions through MQTT
  - "Perform" them by showing them on screen + leds
  - Sends feedback

* front_end/src/components/ActionPage.vue
  - Allow to send actions to the selected device
* front_end/src/store/plugins/mqtt.js
  - Handles MQTT packets
  - Stores MQTT packets to the Vuex store

## Visualisation

### Graphs
* front_end/src/components/MeasureGraph.vue
  - Create graphs
  - feed the data to the graphs
  - shows expected range of values
  - detects the X-axis to use
* front_end/src/components/Chartjs.vue
  - Binding of the Chartjs library

### Engineer page
* front_end/src/components/OverviewPage.vue
  - Shows a list of the devices
* front_end/src/components/Device.vue
  - Shows the state of a device:
    - Its battery level
    - The number of "unusual" measurements detected, by category

### Front page
* front_end/src/components/Dashboard/Views/Maps.vue
  - Shows navigable map of the farm, with the greenhouses
* front_end/src/components/WeatherPage.vue
  - Shows the weather forecast

### Notifications
* front_end/src/components/NotificationsPage.vue and front_end/src/components/NotificationsList.vue
  - Shows notification lists, either in full page or in the top bar
  - Allow user to mark notifications as read or to delete them

* front_end/src/Dashboard/DashboardLayout.vue
  - Creates toast notifications when receiving them in real time

## Robustness

### In general
* The code works even when receiving no/partial data
* Lists of sites/devices retrieved from the API, therefore fully dynamic site
* A lot of error catching to avoid crashes

* Detection of unusual values and critical battery levels
* Usage of MQTT protocol: Auto-reconnection, quality of service on messages
* Applications not sensitive to interferences on the MQTT broker.
* Usage of a private MQTT broker.
