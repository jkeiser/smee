import loadjs from 'loadjs'

// function log(message) {
//   console.log(message) /* eslint-disable-line no-console */
// }

// First: 

const GapiScriptUrl = 'https://apis.google.com/js/api.js'
function status(text) {
//	document.getElementById("result").append(text + "\n")
console.log(text)
}
function loadScriptAndGapi() {
  return new Promise((resolve, reject) => {
    status("Loading api.js ...")
    loadjs("https://apis.google.com/js/api.js", () => resolve(window.gapi), error => reject(error))
  }
}
function loadGapi(gapi) {
  status("Calling gapi.load('client:auth2') ...")
  gapi.load('client:auth2', {
    callback: () => status("gapi.load('client:auth2') SUCCEEDED!"),
    onerror: () => status("gapi.load('client:auth2') FAILED!")
  })
}
loadScriptAndGapi().then(gapi => loadGapi(gapi)).resolve()

// const LoadGapiScript = new Promise((resolve, reject) => {
//   log('Loading ' + GapiScriptUrl + ' ...')
//   loadjs(
//     GapiScriptUrl,
//     () => {
//       log('Loaded ' + GapiScriptUrl + '.')
//       resolve(window.gapi)
//     },
//     error => reject(error)
//   )
// })

// const GapiModules = 'client:auth2'
// async function loadGapi({modules = GapiModules}) {
//   let gapi = await LoadGapiScript
//   return await new Promise((resolve, reject) => {
//     log('Loading ' + modules + ' GAPI modules ...')
//     gapi.load(modules, {
//       callback: () => {
//         log('Loaded ' + modules + ' GAPI modules.')
//         log("Are they the same? " + (gapi == window.gapi))
//         resolve(window.gapi)
//       },
//       onerror: error => reject(error),
//       ontimeout: error => reject(error),
//     })
//   })
// }

// loadGapi('client:auth2').then(gapi => {
//   log('OHAI')
//   log(gapi.auth2.init({}))
//   log(gapi.auth2.getAuthInstance())
//   let authOptions = { apiKey: 'vUi_WGXf_06W3WZYl01qTZZo', clientId: '662782559552-gppt0aji4fop5bqndkdpah5epkfbcsnv.apps.googleusercontent.com' }
//   log(gapi.auth2.init(authOptions))
//   log(gapi.auth2.getAuthInstance())
// }).resolve



// // Initialize Vue
// import Vue from 'vue'
// Vue.config.productionTip = false

// // Add asyncComputed support
// import AsyncComputed from 'vue-async-computed'
// Vue.use(AsyncComputed)

// // Add Semantic UI
// import SuiVue from 'semantic-ui-vue'
// import 'semantic-ui/dist/semantic.min.css'
// Vue.use(SuiVue)

// // Add Router
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)

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

// // Instantiate the app
// import App from './App.vue'
// var vue = new Vue({ render: h => h(App) })
// vue.$mount('#app')