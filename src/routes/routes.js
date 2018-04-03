import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
import Maps from 'src/components/Dashboard/Views/Maps.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
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
