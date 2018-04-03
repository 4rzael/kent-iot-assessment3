<template>
  <div class="wrapper">
    <side-bar>
    <mobile-menu slot="content"></mobile-menu>
    <sidebar-link to="/map">
        <i class="fa fa-dashboard"></i>
        <p>Dashboard</p>
    </sidebar-link>

    <sidebar-link v-for="site in sites" :key="site.id" :to="'/greenhouses/' + site.id">
      <i class="nc-icon nc-bank"></i>
      <p>{{site.name}}</p>
    </sidebar-link>
    <sidebar-link to="/overview">
      <i class="nc-icon nc-settings-tool-66"></i>
      <p>Engineer</p>
    </sidebar-link>
    <sidebar-link to="/actions">
      <i class="fa fa-exchange"></i>
      <p>Actions</p>
    </sidebar-link>

    <sidebar-link to="/weather">
      <i class="nc-icon nc-sun-fog-29"></i>
      <p>Weather</p>
    </sidebar-link>

<!--       <sidebar-link to="/admin/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>User Profile</p>
      </sidebar-link>
      <sidebar-link to="/admin/table-list">
        <i class="nc-icon nc-notes"></i>
        <p>Table list</p>
      </sidebar-link>
      <sidebar-link to="/admin/typography">
        <i class="nc-icon nc-paper-2"></i>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/admin/icons">
        <i class="nc-icon nc-atom"></i>
        <p>Icons</p>
      </sidebar-link>
      <sidebar-link to="/admin/maps">
        <i class="nc-icon nc-pin-3"></i>
        <p>Maps</p>
      </sidebar-link>
      <sidebar-link to="/admin/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>Notifications</p>
      </sidebar-link>
 -->    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

        <dashboard-content @click="toggleSidebar">
        </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  import { mapState } from 'vuex'

  import * as types from '../../../store/mutation-types'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    computed: mapState({
      sites: store => store.api.sites
    }),
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    mounted () {
      this.$store.dispatch('retrieveSites')

      this.$store.subscribe(({type, payload}) => {
        if (type === types.ADD_NOTIFICATION) {
          const notif = payload
          this.$notify(notif)
        }
      })
    }
  }

</script>
