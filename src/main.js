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
import credentials from '../credentials.json'
Vue.use(VueGapi, {
    clientId: credentials['web']['client_id'],
    scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/cloud-platform',
    ].join(' '),
    discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
        'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
        'https://speech.googleapis.com/$discovery/rest?version=v1p1beta1',
    ],
})

// Add Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import LoadTimer from './plugins/LoadTimer'
Vue.use(LoadTimer)

// Instantiate the app and perform initial render
import App from './App.vue'

//
// When semantic CSS is loaded, mount up and make us visible!
//
semanticui.then(() => {
    let vue = new Vue({ render: h => h(App) })
    vue.$mount('#app')
})

