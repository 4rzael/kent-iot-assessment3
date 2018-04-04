import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'

// Admin pages
import GreenhousePage from 'src/components/GreenhousePage'
import OverviewPage from 'src/components/OverviewPage'
import MapPage from 'src/components/Dashboard/Views/Maps.vue'
import WeatherPage from 'src/components/WeatherPage.vue'
import ActionPage from 'src/components/ActionPage'
import NotificationsPage from 'src/components/NotificationsPage'

const routes = [
  {
    path: '/',
    redirect: '/map',
    component: DashboardLayout,
    children: [
      {
        path: 'greenhouses/:id',
        name: 'Greenhouse',
        component: GreenhousePage
      },
      {
        path: 'map',
        name: 'map',
        component: MapPage
      },
      {
        path: 'overview',
        name: 'Overview',
        component: OverviewPage
      },
      {
        path: 'actions',
        name: 'Actions',
        component: ActionPage
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: NotificationsPage
      },
      {
        path: 'weather',
        name: 'Weather',
        component: WeatherPage
      }
    ]
  },
  {
    path: '*',
    redirect: '/map',
    component: DashboardLayout
  }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
