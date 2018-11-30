<template>
    <div class="item">
        <div class="content">
            <div class="header" v-if="initialSender">
                <a :href="`mailto:${initialSender.address}`">
                    <span v-if="initialSender.name" class="ThreadEmailAddressName">{{initialSender.name}}</span>
                    <span v-else :class="ThreadEmailAddressHeader">{{initialSender.address}}</span>
                </a>
            </div>
            <div class="ui header placeholder" v-else></div>
            <div class="description">{{snippet}}</div>
        </div>
    </div> 
</template>

<style>
.ThreadEmailAddressHeader { font-family: monospace }
</style>

<script>
import addressparser from 'nodemailer/lib/addressparser'

function getHeader(message, name) {
    let header = message.payload.headers.find(header => header.name == name)
    if (header) {
        return header.value
    }
}

function getAddressHeader(message, name) {
    return addressparser(getHeader(message, name))
}

export default {
    props: {
        id: String,
        snippet: String,
        historyId: String,
    },
    computed: {
        senders: function() {
            if (!this.messages) { return null }
            return new Set(this.messages.map(message => getAddressHeader(message, 'From')))
        },
        initialSender: function() {
            if (!this.messages) { return null }
            let firstValue = this.senders.values().next()
            if (firstValue) { return firstValue.value[0] }
        },
        labels: function() {
            if (!this.messages) { return null }
            return new Set(this.messages.map(message => message.labels))
        },
    },
    asyncComputed: {
        messages: async function() {
            return await this.$gapi.query(
                `getting message headers for thread ${this.id}`,
                client => client.gmail.users.threads.get({
                    // Use the actual user id rather than 'me' so that if the
                    // user changes, the query will be automatically rerun
                    'userId': this.$gapi.currentUser.id,
                    'id': this.id,
                    'fields': 'messages(id,threadId,historyId,labelIds,internalDate,payload(headers))',
                }),
                result => result.messages.reverse(),
            )
        },
    },
}
</script>