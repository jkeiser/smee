// Initialize Vue
import Vue from 'vue'

// Add Semantic UI
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui/dist/semantic.min.css'
Vue.use(SuiVue)

// Add Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Instantiate the app
import App from './App.vue'
var vue = new Vue({ render: h => h(App) }).$mount('#app')

