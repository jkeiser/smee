<script>
export default {
    props: {
        client: VueGapiClient,
        queryCallback: Function,
    },
    computed: {
        results: function () {
            if (this.client.client) {
                return this.queryCallback(this.client.client)
            } else {
                return null
            }
        },
    },
    methods: {
        query(queryCallback) {
            return new VueGapiQuery(this, queryCallback)
        }
    }
</script>