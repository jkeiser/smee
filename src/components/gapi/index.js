import gapi from './loadgapi.js'
import logAction from './logaction.js'

export default {
    install: function(Vue, {clientId,scope}) {
        Vue.prototype.$gapi = new Vue(GapiAuth)
        gapi.initialize({clientId,scope})
    }
}

const GapiAuth = {
    data: () => ({
      isSignedIn: null,
      signingInOrOut: null,
    }),
    methods: {
      gapi: async function() { return await gapi },
      authInstance: async function() {
        return (await this.gapi()).auth2.getAuthInstance()
      },
      signIn: async function() {
        if (this.signingInOrOut != null) {
          throw new GapiAlreadySigningInOrOutError(this.signingInOrOut)
        }
        this.signingInOrOut = true
        let GoogleAuth = await this.authInstance()
        try {
            await logAction.promise("signing in", (resolve, reject) => GoogleAuth.signIn().then(resolve, reject))
        } finally {
            this.signingInOrOut = null
        }
      },
      signOut: async function() {
        if (this.signingInOrOut != null) {
          throw new GapiAlreadySigningInOrOutError(this.signingInOrOut)
        }
        this.signingInOrOut = false
        let GoogleAuth = await this.authInstance()
        try {
            return await logAction.promise("signing out", (resolve, reject) => GoogleAuth.signOut().then(resolve, reject))
        } finally {
            this.signingInOrOut = null
        }
      },
      client: async function(discoveryDoc) {
          let gapi = await this.gapi()
          await logAction.promise(`loading Google API at ${discoveryDoc}`, (resolve, reject) => gapi.client.load(discoveryDoc).then(resolve, reject))
          return gapi.client
      }
    },
    // Subscribe to isSignedIn
    created: async function() {
        let GoogleAuth = await this.authInstance()
        GoogleAuth.isSignedIn.listen(isSignedIn => this.isSignedIn = isSignedIn)
        this.isSignedIn = GoogleAuth.isSignedIn.get()
    },
}
