import './docs.scss'
import {create} from './demo-block/plugin'
import Components from '../src/components/UIComponents'
const Vue = window.Vue
import { directive as vClickOutside } from 'vue-clickaway'
window.Vue.directive('click-outside', vClickOutside)

for (let key in Components) {
  const toRegister = Components[key]
  if (toRegister.install) {
    Vue.use(toRegister)
  } else {
    Vue.component(toRegister.name, toRegister)
  }
}
window.DemoBoxVue = {
  create
}
