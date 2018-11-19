import GapiClient from './GapiClient.vue'

export default {
    install: function(Vue, {clientId,scope}) {
        Vue.prototype.$gapi = new Vue(GapiAuth.initialize({clientId,scope}))
    }
}
