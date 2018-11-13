<template>
    <div>
        <sui-modal ref="authenticating">
            <!-- <sui-modal-content v-model="authenticating">
                <iframe ref="authframe" class="authframe" :src="authUrl" />
            </sui-modal-content> -->
        </sui-modal>
    </div>
</template>

<style>
.authframe {
    width: 90%;
    height: 90%;
}
</style>

<script>
import GoogleAuthenticatorCallback from './GoogleAuthenticatorCallback.vue'
let callbackPath = '/googleauthenticator/callback'

export default {
    name: 'GoogleAuthenticator',
    props: {
        clientId: String,
        clientKey: String,
        discoveryDocs: Set,
        scopes: { type: Set, default: () => new Set() },
    },
    // 1. let client = await this.$google.authorize(...scopes)
    // 2. client.gmail.get('...')
    asyncComputed: {
        client: {
            lazy: true,
            get: async function() {
//                return googleapis
                // await gapi.load('client:auth2')
                // console.log(gapi)
                // let api = gapi
                // await api.client.init({
                //     apiKey: this.clientKey,
                //     clientId: this.clientId,
                //     discoveryDocs: this.discoveryDocs,
                //     scopes: this.scopes,
                // })
                // console.log(api)
                // console.log(api.client)
                // return gapi.client
            }
        }
    },
    methods: {
        // authenticate: async function(scopes) {
        //     return this.$_gapi()
        // },
        // $_authUrl: function(scopes) {
        //     return this.oauth2().generateAuthUrl({
        //         access_type: 'offline',
        //         scopes: scopes,
        //         redirectUrl: this.$_redirectUrl()
        //     })
        // },
        // $_redirectUrl: function() {
        //     this.$router.resolve(callbackPath)
        // },
        // $_oauth2: function() {
        //     return new google.auth.OAuth2(
        //         this.clientId,
        //         this.clientSecret,
        //         this.$_redirectUrl()
        //     )
        // }
    },
    routes: [
        { path: callbackPath, component: GoogleAuthenticatorCallback, props: true }
    ]
}
</script>