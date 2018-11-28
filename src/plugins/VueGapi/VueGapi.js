/* eslint-disable no-console */
let LoadedGapi = import('./loadgapi').then(loadgapi => loadgapi.LoadedGapi)

import logAction from './logaction.js'
import { VueGapiCannotSignInOrOutError } from './VueGapiError'

export const SignInState = {
    LOADING: 'loading',
    SIGNED_IN: 'signed in',
    SIGNING_OUT: 'signing out',
    SIGNED_OUT: 'signed out',
    SIGNING_IN: 'signing out',
}

export const VueGapi = {
    data: {
        // Input parameters set by Vue.install
        clientId: null,
        scope: null,
        discoveryDocs: [],

        isInitialized: false,
        isSignedIn: null,
        currentUser: null,
        signingIn: null,
        signingOut: null,
    },
    computed: {
        basicProfile: function() {
            if (this.currentUser) {
                let basicProfile = this.currentUser.getBasicProfile()
                return {
                    id: basicProfile.getId(),
                    name: basicProfile.getName(),
                    givenName: basicProfile.getGivenName(),
                    familyName: basicProfile.getFamilyName(),
                    imageUrl: basicProfile.getImageUrl(),
                    email: basicProfile.getEmail(),
                }
            } else {
                return {}
            }
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
    asyncComputed: {
        gapi: async function() {
            let gapi = await LoadedGapi
            await logAction.async(
                `initializing gapi.auth2 with client_id ${this.clientId} and scope ${this.scope}`,
                gapi.auth2.init({client_id: this.clientId, scope: this.scope})
            )
            await logAction.async(
                `initializing gapi.client with clientId ${this.clientId}, scope ${this.scope}, and discoveryDocs ${this.discoveryDocs}`,
                gapi.client.init({ clientId: this.clientId, scope: this.scope, discoveryDocs: this.discoveryDocs })
            )
            return gapi
        },
        client: async function() {
            if (this.gapi) {
                return this.gapi.client
            }
        },
        auth2: async function() {
            if (this.gapi) {
                return this.gapi.auth2
            }
        },
        authInstance: async function() {
            if (this.auth2) {
                return await logAction.async(
                    `awaiting auth instance initialization`,
                    this.auth2.getAuthInstance()
                )
            }
        }
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
                if (this.signInState != SignInState.SIGNED_IN) {
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
                this.isInitialized = true
            } else {
                this.isSignedIn = null
                this.currentUser = null
            }
        },
    },
}

export default VueGapi