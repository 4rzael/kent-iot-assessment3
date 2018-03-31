<template>
  <drop-down tag="li">
    <template slot="title">
      <i class="nc-icon nc-planet"></i>
      Notifications
      <b class="caret"></b>
      <span v-if="unreadNumber > 0" class="notification">{{unreadNumber}}</span>
    </template>
    <div v-for="notif in notifs" :key="notif._id" :class="{ read: notif.read, 'dropdown-item': true }" style="padding-bottom: 25px;">
      <!-- <a style="float:left" href="#" :class="{ read: notif.read }" @click="readNotification(notif)">{{notif.message}}</a> -->
      <!-- <a style="float:right"><i :class="{ read: notif.read, 'nc-icon': true, 'nc-simple-remove': true }" @click="deleteNotification(notif)"></i></a> -->
      <a style="float:left" href="#" @click="readNotification(notif)">{{notif.message}}</a>
      <a style="float:right"><i style="cursor:pointer;" class="nc-icon nc-simple-remove" @click="deleteNotification(notif)"></i></a>
    </div>
  </drop-down>
</template>

<script>
  export default {
    computed: {
      notifs () {
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
      this.$store.dispatch('retrieveNotifications')
    }
  }

</script>
<style>
.read {
  background-color: #d6d6d6;
}
</style>
