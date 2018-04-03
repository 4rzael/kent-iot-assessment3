<template>
  <drop-down tag="li">
    <template slot="title">
      <i class="nc-icon nc-planet"></i>
      Notifications
      <b class="caret"></b>
      <span v-if="unreadNumber > 0" class="notification">{{unreadNumber}}</span>
    </template>
    <div v-for="notif in notifs" :key="notif._id" :class="{'notif-body': true, read: notif.read}">
      <!-- <a style="float:left" href="#" :class="{ read: notif.read }" @click="readNotification(notif)">{{notif.message}}</a> -->
      <!-- <a style="float:right"><i :class="{ read: notif.read, 'nc-icon': true, 'nc-simple-remove': true }" @click="deleteNotification(notif)"></i></a> -->
      <a class="notif-text" href="/#/notifications" @click="readNotification(notif)">{{notif.message}}</a>
      <a class="notif-x"><i style="cursor:pointer;" class="nc-icon nc-simple-remove" @click="deleteNotification(notif)"></i></a>
      <span class="notif-date">{{notifDate(notif)}}</span>
      <a class="notif-read" href="#" @click="readNotification(notif)">read</a>
    </div>
  </drop-down>
</template>

<script>
  import moment from 'moment'

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
      },
      notifDate (notif) {
        return moment(notif.date).fromNow()
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

.notif-body {
  padding-bottom: 50px;
}

.notif-text {
  float:left;
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre;
}

.notif-x {
  float:right;
  width: 5%;
}

.notif-date {
  font-size: 11px;
  color: grey;
  float: left;
}

.notif-read {
  float: right;
  width: 15%;
  font-size: 12px;
  font-style: italic;
  text-decoration: underline;
}

</style>
