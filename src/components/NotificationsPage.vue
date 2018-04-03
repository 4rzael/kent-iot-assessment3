<template>
  <div style="margin-left: 25px">
    <h1>Notifications</h1>
    <p style="font-size: larger">This page is a page dedicated both to engineers and farmers.
      It's purpose is...</p>

    <l-table class="table table-hover table-striped" :columns="tableColumns" :data="tableData">
      <template slot="columns">
          <th><i class="fa fa-calendar"></i>Date</th>
          <th><i class="fa fa-exclamation-triangle"></i>Notification</th>
          <th><i class="fa fa-bolt"></i>Action</th>
      </template>
      <template slot-scope="{row}">
        <td style="font-size: smaller">{{row.date}}</td>
        <td><b>{{row.message}}</b></td>
        <td>
          <button class="btn btn-icon btn-info" @click="readNotification(row)"><i class="fa fa-eye"></i></button>
          <button class="btn btn-icon btn-danger" @click="deleteNotification(row)"><i class="fa fa-trash"></i></button>
        </td>
      </template>
    </l-table>
  </div>
</template>

<script>
  import LTable from 'src/components/UIComponents/Table.vue'

  export default {
    components: {
      LTable
    },
    data() {
      return {
        tableColumns: ['date', 'description', 'action'],
        babar: 42,
        tableData: []
        }
      },
    computed: {
      notifs () {
        // return this.$store.state.notifications.notifications.map((notification, index) => ({
        //                                               id: index, description: notification.message}))
        return this.$store.state.notifications.notifications
      },
      unreadNumber () {
        return this.notifs.filter(n => n.read === false).length
      }
    },
    methods: {
      readNotification (notif) {
        this.$store.dispatch('readNotification', notif)
      },
      deleteNotification (notif) {
        this.$store.dispatch('deleteNotification', notif)
      }
    },
    mounted () {
      this.$store.dispatch('retrieveNotifications'),
      this.tableData = this.notifs
    }
  }

</script>
