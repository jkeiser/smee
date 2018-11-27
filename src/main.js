/* eslint-disable no-console */
// Set the GAPI to loading while we load Vue. (Asynchronous)
import('./plugins/VueGapi/loadgapi')

// Initialize Vue
import Vue from 'vue'
Vue.config.productionTip = false

// Add asyncComputed support
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

// Bring in VueGapi
import VueGapi from './plugins/VueGapi'
Vue.use(VueGapi, {
    clientId: '662782559552-gppt0aji4fop5bqndkdpah5epkfbcsnv.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    discoveryDocs: [ 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest' ],
})

// Add Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import LoadTimer from './plugins/LoadTimer'
Vue.use(LoadTimer)

// Instantiate the app
import App from './App.vue'
import AppPage from './components/AppPage'
Vue.component('AppPage', AppPage)
var vue = new Vue({ render: h => h(App) })

// Load semantic UI CSS and JS in parallel
let loadSemanticUi = Promise.all([
    import('semantic-ui-css/semantic.css'),
    import('jquery').then(jquery => { window.$ = window.jQuery = jquery.default }).then(import('semantic-ui-css/semantic.js')),
])

// Once semantic UI is ready, mount the app so our render becomes visible
loadSemanticUi.then(() => vue.$mount('#app'))

