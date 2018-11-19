<script>
export default {
    props: {
        discoveryDoc: [Array]
    },
    asyncComputed: {
        client: async function () {
            if (this.$gapi.$_client == null) {
                return null
            }
            logAction.googlePromise("Loading discovery doc ${this.discoveryDoc} ...", this.$gapi.$_client.load(this.discoveryDoc))
        }
    },
    methods: {
        query(queryCallback) {
            return new VueGapiQuery(this, queryCallback)
        }
    }
</script>