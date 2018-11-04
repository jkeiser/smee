import Vue from 'vue'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue';
import 'semantic-ui/dist/semantic.min.css';
import 'moment'

Vue.config.productionTip = false
Vue.use(SuiVue);

new Vue({
  render: h => h(App)
}).$mount('#app')
