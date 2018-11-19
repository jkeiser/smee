// Initialize Vue
import Vue from 'vue'
Vue.config.productionTip = false

// Add asyncComputed support
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

// Add Semantic UI
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui/dist/semantic.min.css'
Vue.use(SuiVue)

// Add Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Gapi from './components/gapi'
Vue.use(Gapi, {
    clientId: '662782559552-gppt0aji4fop5bqndkdpah5epkfbcsnv.apps.googleusercontent.com',
    scope: [
        'https://www.googleapis.com/auth/gmail.readonly'
    ]
})

// // Use vue-gapi
// import VueGAPI from 'vue-gapi';
// Vue.use(VueGAPI, {
//     apiKey: 'vUi_WGXf_06W3WZYl01qTZZo',
//     clientId: '662782559552-gppt0aji4fop5bqndkdpah5epkfbcsnv.apps.googleusercontent.com',
//     discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
//     scope: 'https://www.googleapis.com/auth/spreadsheets'
//     // see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
//   }
// );

// Instantiate the app
import App from './App.vue'
var vue = new Vue({ render: h => h(App) })
vue.$mount('#app')