/* eslint-disable no-console */
import { initializeGapi } from './loadgapi'
import logAction from '../../scripts/logaction.js'
import { VueGapiCannotSignInOrOutError, VueGapiAlreadyInstalledError } from './VueGapiError'

export const SignInState = {
    LOADING: 'loading',
    SIGNED_IN: 'signed in',
    SIGNING_OUT: 'signing out',
    SIGNED_OUT: 'signed out',
    SIGNING_IN: 'signing out',
}

export default {
    install(Vue, {clientId, scope, discoveryDocs}) {
        if (VueGapi.initializedPromise) {
            throw new VueGapiAlreadyInstalledError('VueGapi has already been installed! (VueGapi.initializedPromise is already set.)')
        }
        VueGapi.initializedGapiPromise = initializeGapi({clientId, scope, discoveryDocs})
        Vue.prototype.$gapi = new Vue(VueGapi)
    }
}

const VueGapi = {
    data: function() {
        return {
            isSignedIn: null,
            currentUser: null,
            signingIn: null,
            signingOut: null,

            // If you want to be reactively notified when the gapi is set, use this.
            gapi: null,
            // If you want to wait until the gapi is ready and we're all initialized, use this.
            gapiPromise: this.$_initialize(),
        }
    },
    computed: {
        isInitialized: function() {
            return !!this.gapi
        },
        isBusy: function() {
            return this.signInState != SignInState.SIGNED_IN && this.signInState != SignInState.SIGNED_OUT
        },
        signInState: function() {
            if (!this.isInitialized) {
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
                if (this.signInState != SignInState.SIGNED_OUT) {
                    throw new VueGapiCannotSignInOrOutError(this.signInState, 'sign in');
                }
                this.signingIn = logAction.async('signing in', this.gapi.authInstance.getAuthInstance().signIn())
            }
            try {
                return await this.signingIn
            } finally {
                this.signingIn = null
            }
        },
        signOut: async function() {
            if (!this.signingOut) {
                if (this.signInState != SignInState.SIGNED_IN) {
                    throw new VueGapiCannotSignInOrOutError(this.signInState, 'sign out');
                }
                this.signingOut = logAction.async('signing out', this.gapi.authInstance.getAuthInstance().signOut())
            }
            try {
                return await this.signingOut
            } finally {
                this.signingOut = null
            }
        },
        query: async function(description, query, result) {
            let gapi = await this.$gapi.gapiPromise
            let response = await logAction.async(description, query(gapi.client))
            return result ? result(response.result) : response
        },

        $_updateCurrentUser: function(user) {
            if (user) {
                let profile = user.getBasicProfile()
                this.currentUser = {
                    id: user.getId(),
                    hostedDomain: user.getHostedDomain(),
                    grantedScopes: user.getGrantedScopes(),
                    profileId: profile.getId(),
                    name: profile.getName(),
                    givenName: profile.getGivenName(),
                    familyName: profile.getFamilyName(),
                    imageUrl: profile.getImageUrl(),
                    email: profile.getEmail(),
                }
            } else {
                this.currentUser = {}
            }
        },

        $_initialize: async function() {
            let gapi = await VueGapi.initializedGapiPromise
            let authInstance = await gapi.auth2.getAuthInstance()
        
            // Listen for isSignedIn and currentUser
            authInstance.isSignedIn.listen(isSignedIn => { this.isSignedIn = isSignedIn })
            this.isSignedIn = authInstance.isSignedIn.get()
            authInstance.currentUser.listen(this.$_updateCurrentUser)
            this.$_updateCurrentUser(authInstance.currentUser.get())

            this.gapi = gapi

            return gapi
        },
    },
}
