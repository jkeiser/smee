<template>
    <div>
        <Labels />
        <Threads />
    </div>
</template>

<script>
import Labels from './Labels.vue'
import Threads from './Threads.vue'

export default {
    components: { Labels, Threads },
    asyncComputed: {
        threads: async function() {
            return await this.$gapi.query(
                'listing messages',
                client => client.gmail.users.threads.list({'userId': 'me'}),
                r => r.threads
            )
        },
    }
}
</script>
