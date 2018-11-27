/* eslint-disable no-console */
// Initialize Vue
import Vue from 'vue'
Vue.config.productionTip = false

// Add asyncComputed support
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

// Add Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueGapi from './plugins/VueGapi'
Vue.use(VueGapi, {
    clientId: '662782559552-gppt0aji4fop5bqndkdpah5epkfbcsnv.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    discoveryDocs: [ 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest' ],
})

import LoadTimer from './plugins/LoadTimer'
Vue.use(LoadTimer)

// Instantiate the app
import App from './App.vue'
import AppPage from './components/AppPage'
Vue.component('AppPage', AppPage)
var vue = new Vue({ render: h => h(App) })
vue.$mount('#app')

