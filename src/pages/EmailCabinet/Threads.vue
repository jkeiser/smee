<template>
    <div class="ui items">
        <Thread v-for="thread in threads" :key="thread.id" v-bind="thread" class="item" />
    </div>
</template>

<script>
import Thread from './Thread'

export default {
    components: { Thread },
    asyncComputed: {
        threads: async function() {
            return await this.$gapi.query(
                'listing threads',
                client => client.gmail.users.threads.list({
                    // Use the actual user id rather than 'me' so that if the
                    // user changes, the query will be automatically rerun
                    'userId': this.$gapi.currentUser.id,
                    'fields': 'threads(id,snippet,historyId)',
                }),
                result => [ result.threads[0], result.threads[1] ],
            )
        },
    },
}
</script>