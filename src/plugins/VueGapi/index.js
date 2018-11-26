/* eslint-disable no-console */
import VueGapi from './VueGapi'
import { VueGapiRequiredArgumentError, VueGapiAlreadyInstalledError } from './VueGapiError'

// Re-export SignInState and errors for people who use the library
export { SignInState } from './VueGapi'
export * from './VueGapiError'

const isRequired = name => { throw new VueGapiRequiredArgumentError(`Missing parameter ${name} required by VueGapi plugin. Usage: Vue.use(VueGapi, {clientId: '...', scope: [...]})`); }

export default {
    /**
     * Install the VueGapi plugin.
     * 
     * Creates a $gapi property on every Vue object with asynchronous
     * access to the global VueGapi instance.
     * 
     * @see {@link https://developers.google.com/api-client-library/javascript/start/start-js#setup} to create a clientId.
     * 
     * @param {Vue} Vue Vue class (import Vue from 'vue')
     * @param {Object} clientConfig Client options
     * @param {string} clientConfig.clientId The app's client ID, found and created in the credentials section of the Google Developers Console ({@link https://console.cloud.google.com/apis/credentials}).
     * @param {string} clientConfig.scope The security scope URI (see {@link https://developers.google.com/identity/protocols/googlescopes} for scope URIs for the services you want to access)
     * @param {Array} clientConfig.discoveryDocs Discovery Docs for the APIs you want to use, which will be loaded into the client automatically.
     */
    install(Vue, { clientId = isRequired('clientId'), scope = isRequired('scope'), discoveryDocs = [] } = {}) {
        if (Vue.prototype.$gapi) {
            throw new VueGapiAlreadyInstalledError('VueGapi has already been installed! (Vue.prototype.$gapi is already set.)')
        }
        // Set configuration
        VueGapi.data.clientId = clientId
        VueGapi.data.scope = scope
        VueGapi.data.discoveryDocs = discoveryDocs
        Vue.prototype.$gapi = new Vue(VueGapi)
    },
}
