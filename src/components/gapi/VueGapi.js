import gapi from "./loadgapi.js";
import logAction from "./logaction.js";
import VueGapiClient from "./VueGapiClient.js"

export default {
    // Let initialize be called (exactly once)
    initialize({ clientId, scope }) {
        gapi.initialize({ clientId, scope });
        this.initialize = null;
        return this;
    },
    data: () => ({
        isSignedIn: null,
        signingInOrOut: null
    }),
    methods: {
        client: async function (discoveryDoc) {
            return new VueGapiClient(this, discoveryDoc);
        },
        signIn: async function () {
            if (this.signingInOrOut != null) {
                throw new GapiAlreadySigningInOrOutError(this.signingInOrOut);
            }
            this.signingInOrOut = true;
            let GoogleAuth = await this.$_authInstance();
            try {
                await logAction.googlePromise("signing in", GoogleAuth.signIn())
            } finally {
                this.signingInOrOut = null;
            }
        },
        signOut: async function () {
            if (this.signingInOrOut != null) {
                throw new GapiAlreadySigningInOrOutError(this.signingInOrOut);
            }
            this.signingInOrOut = false;
            let GoogleAuth = await this.$_authInstance();
            try {
                return await logAction.googlePromise("signing out", GoogleAuth.signOut())
            } finally {
                this.signingInOrOut = null;
            }
        },

        $_gapi: async function () {
            return await gapi;
        },
        $_authInstance: async function () {
            return (await this.$_gapi()).auth2.getAuthInstance();
        },
        $_client: async function (discoveryDoc) {
            let gapi = await this.gapi();
            await logAction.googlePromise(
                `loading Google API at ${discoveryDoc}`,
                gapi.client.load(discoveryDoc)
            );
            return gapi.client;
        }
    },
    // Subscribe to isSignedIn
    created: async function () {
        let GoogleAuth = await this.authInstance();
        GoogleAuth.isSignedIn.listen(isSignedIn => (this.isSignedIn = isSignedIn));
        this.isSignedIn = GoogleAuth.isSignedIn.get();
    }
}
