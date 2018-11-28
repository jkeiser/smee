//
// Load long dependencies in the background
//

// GAPI has a long series of http requests to make
import './plugins/VueGapi/loadgapi'

// Semantic UI's CSS takes a while and loads a bunch of fonts
let semanticcss = import('semantic-ui-css/semantic.css')

// Semantic UI's JS is necessary to make things work, but not
// necessarily to make them look right. (TODO this might not be true :)
import('./scripts/loadsemanticuijs')

//
// Load up and render in the background (but don't mount until CSS is ready)
//

import Vue from 'vue'

// Initialize Vue
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

// Instantiate the app and perform initial render
import App from './App.vue'
import AppPage from './components/AppPage'
Vue.component('AppPage', AppPage)
let vue = new Vue({ render: h => h(App) })

//
// When semantic CSS is loaded, mount up and make us visible!
//
semanticcss.then(() => vue.$mount('#app'))

