//
// Load long dependencies in the background
//

// GAPI has a long series of http requests to make
import './plugins/VueGapi/loadgapi'

// Semantic UI's CSS and JS take a while and load a bunch of fonts
let semanticui = Promise.all([
    import('semantic-ui-css/semantic.css'),
    import('jquery').then(jquery => {
        window.$ = window.jQuery = jquery.default
        import('semantic-ui-css/semantic.js')
    })
])

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

//
// When semantic CSS is loaded, mount up and make us visible!
//
semanticui.then(() => {
    let vue = new Vue({ render: h => h(App) })
    vue.$mount('#app')
})

