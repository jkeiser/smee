/* eslint-disable no-console */
import logAction from './logaction.js'
import { gapiPromise, setGapiClientConfig } from './gapipromise.js'

export class VueGapiError extends Error {}
export class VueGapiRequiredArgumentError extends VueGapiError {}
export class VueGapiAlreadyInstalledError extends VueGapiError {}
export class VueGapiCannotSignInOrOutError extends VueGapiError {
    action
    signInState
    constructor(signInState, action) {
        super(`Cannot ${action} while we are currently ${signInState}!`)
        this.action = action
        this.signInState = signInState
    }
}

export const SignInState = {
    LOADING: "loading",
    SIGNED_IN: "signed in",
    SIGNING_OUT: "signing out",
    SIGNED_OUT: "signed out",
    SIGNING_IN: "signing out",
}

const VueGapi = {
    data: function() {
        return {
            // Core gapi objects
            gapiPromise,

            // State
            currentUser: null,
            isSignedIn: null,
            signingIn: null,
            signingOut: null,
        }
    },
    asyncComputed: {
        gapi: async function() {
            return await this.gapiPromise
        },
    },
    computed: {
        authInstance: function() {
            if (this.gapi) {
                return this.gapi.auth2.getAuthInstance()
            }
        },
        client: function() {
            if (this.signInState == SignInState.SIGNED_IN) {
                return this.gapi.client
            }
        },
        basicProfile: function() {
            if (this.currentUser) {
                let profile = this.currentUser.getBasicProfile()
                return {
                    id: profile.getId(),
                    name: profile.getName(),
                    givenName: profile.getGivenName(),
                    familyName: profile.getFamilyName(),
                    imageUrl: profile.getImageUrl(),
                    email: profile.getEmail(),
                }
            }
        },
        inProgress: function() {
            return this.signInState != SignInState.SIGNED_IN && this.signInState != SignInState.SIGNED_OUT;
        },
        canSignIn: function() {
            return this.signInState == SignInState.SIGNED_OUT
        },
        canSignOut: function() {
            return this.signInState == SignInState.SIGNED_IN
        },        
        signInState: function() {
            if (this.isSignedIn == null) {
                return SignInState.LOADING
            } else if (this.signingIn) {
                return SignInState.SIGNING_IN
            } else if (this.signingOut) {
                return SignInState.SIGNING_OUT
            } else if (this.isSignedIn) {
                return SignInState.SIGNED_IN
            } else {
                return SignInState.SIGNED_OUT
            }
        },
    },
    methods: {
        /**
         * Sign in the Google client
         * @throws {VueGapiCannotSignInOrOutError}
         */
        signIn: async function() {
            if (!this.signingIn) {
                if (!this.canSignIn) {
                    throw new VueGapiCannotSignInOrOutError(this.signInState, 'sign in');
                }
                this.signingIn = logAction.async('signing in', this.authInstance.signIn())
            }
            try {
                return await this.signingIn
            } finally {
                this.signingIn = null
            }
        },
        signOut: async function() {
            if (!this.signingOut) {
                if (!this.canSignOut) {
                    throw new VueGapiCannotSignInOrOutError(this.signInState, 'sign out');
                }
                this.signingOut = logAction.async('signing out', this.authInstance.signOut())
            }
            try {
                return await this.signingOut
            } finally {
                this.signingOut = null
            }
        },
        loadDiscoveryDoc: async function(discoveryDoc) {
            if (this.client) {
                return await logAction.async(`loading Google API discovery doc ${discoveryDoc} ...`, this.client.load(discoveryDoc))
            }
        },
        query: async function(description, query) {
            if (this.client) {
                return await logAction.async(description, query(this.client))
            }
        },
    },
    watch: {
        signInState: function(signInState) { console.warn(signInState) },
        authInstance: async function(authInstance) {
            if (authInstance) {
                this.isSignedIn = authInstance.isSignedIn.get()
                authInstance.isSignedIn.listen(isSignedIn => {
                    this.isSignedIn = isSignedIn
                });
                this.currentUser = authInstance.currentUser.get()
                authInstance.currentUser.listen(currentUser => {
                    this.currentUser = currentUser
                });
            }
        },
    },
}

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
        setGapiClientConfig({ clientId, scope, discoveryDocs })
        Vue.prototype.$gapi = new Vue(VueGapi)
    },
}
