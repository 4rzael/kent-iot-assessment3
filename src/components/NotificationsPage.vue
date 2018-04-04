<template>
  <div style="margin-left: 25px">
    <h1>Notifications</h1>
    <p style="font-size: larger">
      This page is a page dedicated both to engineers and farmers.
      It's purpose is to display all the latest notifications.</p>
    <l-table class="table table-hover table-striped" :columns="tableColumns" :data="notifs">
      <template slot="columns">
          <th><i class="fa fa-exclamation"></i>Id</th>
          <th><i class="fa fa-calendar"></i>Date</th>
          <th><i class="fa fa-exclamation-triangle"></i>Notification</th>
          <th><i class="fa fa-bolt"></i>Action</th>
      </template>
      <template slot-scope="{row}">
        <td class="makeSmaler" :style="notificationSeenStyle(row.read)">{{row.id}}</td>
        <td class="makeSmaler" :style="notificationSeenStyle(row.read)">{{prettyDate(row.date)}}</td>
        <td :style="notificationSeenStyle(row.read)"><b>{{row.description}}</b></td>
        <td class="buttonsStyle" :style="notificationSeenStyle(row.read)">
          <button class="btn btn-icon btn-info" v-if="!row.read" @click="readNotification(row.id)"><i class="fa fa-eye"></i></button>
          <button class="btn btn-icon btn-info" v-else><i class="fa fa-eye-slash"></i></button>
          <button class="btn btn-icon btn-danger" @click="deleteNotification(row.id)"><i class="fa fa-trash"></i></button>
        </td>
      </template>
    </l-table>
  </div>
</template>

<script>
  import moment from 'moment'
  import LTable from 'src/components/UIComponents/Table.vue'

  export default {
    components: {
      LTable
    },
    data () {
      return {
        tableColumns: ['id', 'date', 'description', 'action'],
        }
    },
    computed: {
      notifs () {
        return this.$store.state.notifications.notifications.map((notification, index) => ({
                                                      id: index,
                                                      date: notification.date,
                                                      description: notification.message,
                                                      read: notification.read}))
      },
      unreadNumber () {
        return this.notifs.filter(n => n.read === false).length
      }
    },
    methods: {
      readNotification (id) {
        const notif = this.$store.state.notifications.notifications[id]

        this.$store.dispatch('readNotification', notif)
      },
      deleteNotification (id) {
        const notif = this.$store.state.notifications.notifications[id]
        this.$store.dispatch('deleteNotification', notif)
      },
      prettyDate (date) {
        const m = moment(date)
        return `${m.format('ddd, MMM Do YYYY, k:mm')} (${m.fromNow()})`
      },
      notificationSeenStyle(read) {
        let retVal = 'background-color: '

        return retVal += (read ? '#BEBEBE;' : 'none')
      }
    },
    mounted () {
      this.$store.dispatch('retrieveNotifications')
    }
  }
</script>
<style>
  .makeSmaler {
    font-size: smaller
  }
  .buttonsStyle {
    text-align: center;
  }
</style>
