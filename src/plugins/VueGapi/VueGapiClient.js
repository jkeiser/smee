import logAction from '../../scripts/logaction'

export default {
    props: {
        scope: String,
        discoveryDocs: Array,
    },
    data: function() {
        return {
            client: null,
            initializedPromise: this.$_initialize(),
        }
    },
    methods: {
        $_initialize: async function() {
            await this.$gapi.initializedPromise
            let authInstance = this.$gapi.gapi.auth2.getAuthInstance()
            if (this.scope) {
                await logAction.async(`granting scope ${this.scope}`, authInstance.grant(this.scope))
            }
            for (let discoveryDoc of this.discoveryDocs) {
                await logAction.async(`loading discovery doc ${discoveryDoc}`, this.$gapi.gapi.client.load(discoveryDoc))
            }
            this.client = this.$gapi.gapi.client
            return this.client
        },
    }
}