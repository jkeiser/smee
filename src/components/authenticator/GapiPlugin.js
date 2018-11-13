// Function to asynchronously load JS (using a Promise)
import loadjs from 'loadjs'
async function loadjsPromise(url) {
    loadjs(url, () => resolve(), error => reject(error))
}
// GAPI JS loader (global promise that only runs once, first time you use)
const GapiScriptUrl = 'https://apis.google.com/js/api.js'
let loadGapi = loadjsPromise(GapiScriptUrl).then(window.gapi.load('client:auth2')).then(resolve => resolve(window.gapi))
class GapiClient {
    constructor({apiKey, clientId}) {
        this.apiKey = apiKey
        this.clientId = clientId
        this._scopes = new Set()
        this._discoveryUrls = new Set()
        this._googleAuth = this._initGoogleAuth()
    }
    onLoadProgress(callback) {
        return this
    }
    signedIn() {
        this.
    }
    onSigninChange(callback) {
        onSignIn
    }
    scopes(scopes=null) {
        if (scopes != null) {
            this._scopes += scopes
        }
        return this._scopes
    }
    discoveryUrls(discoveryUrls=null) {
        if (discoveryUrls != null) {
            this._discoveryUrls += discoveryUrls
        }
        return this._discoveryUrls
    }

    // Only meant to be called once (the first time)
    async _initGoogleAuth() {
        let gapi = await loadGapi
        let authOptions = { apiKey: this.apiKey, clientId: this.clientId, scopes: this._scopes, discoveryUrls: this._discoveryUrls }
        gapi.auth2.init(clientOptions)
        return gapi.auth2.getAuthInstance()
    }
}

return {
    

    GoogleAuth: new Promise((resolve, reject) => {
        clientOptions = { apiKey: this.apiKey, clientId: this.clientId, scopes: this.scopes, discoveryUrls: this.discoveryUrls }
        window.gapi.auth2.init()
        resolve(window.gapi.auth2.getAuthInstance());
})

// Initialize signedIn and listen for changes to signin status
this.updateSigninStatus()
GoogleAuth.isSignedIn.listen(this.updateSigninStatus);

const GapiClient = {
    props: {
        clientId: String,
        apiKey: String,
        scopes: { type: Set, default: new Set() },
        discoveryUrls: { type: Set, default: new Set() },
    },
    data: function() {
        return {
            signedIn: false,
            googleAuthPromise: null,
        }
    },
    watch: {
        scopes: function(newScopes, _) {
            if (this.signedIn) {
                this.updateGrant(newScopes)
            }
        },
        discoveryUrls: function(oldDiscoveryUrls, _) {
            gapi.load()
        }
    },
    created: function() {
        // Prepare auth and listen for sign-in state changes.
        await this.load()
    },
    methods: {
        signIn: async function() {
            this.currentUser().signIn(this.signInOptions())
        },
        signOut: async function() {
            this.currentUser().signOut()
        },

        // not really part of public interface
        signInOptions: function() {
            return {
                scope: this.scopeString(),
            }
        },
        currentUser: function() {
            this.googleAuth().currentUser.get()
        },
        updateGrant: async function() {
            this.currentUser().grant(this.signInOptions())
        },
        updateSigninStatus: function() {
            this.signedIn = this.currentUser().isSignedIn();
        },
        scopeString: function() {
            this.scopes.join(" ")
        }
    },
}

export default {
    install: function(Vue, clientConfig) {
        Vue.prototype.gapiClient = new GapiClient()
    }
}
