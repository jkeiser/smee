<template>
    <div class="item">
        <div class="content">
            <div class="header" v-if="sender">
                <a :href="`mailto:${sender.address}`">
                    <span v-if="sender.name" class="ThreadEmailAddressName">{{sender.name}}</span>
                    <span v-else class="ThreadEmailAddressHeader">{{sender.address}}</span>
                </a>
            </div>
            <div class="ui header placeholder" v-else></div>
            <Label v-for="label in labels" v-bind:key="label.id" v-bind="label" />
            <div class="description">{{snippet}}</div>
        </div>
    </div> 
</template>

<style>
.ThreadEmailAddressHeader { font-family: monospace }
</style>

<script>
import Label from './Label'
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
        allLabels: Array,
    },
    computed: {
        sender: function() {
            if (!this.thread) { return null }
            let initialMessage = this.thread.messages[0]
            return getAddressHeader(initialMessage, 'From')[0]
        },
        gmailThreadUrl: function() {
            return `https://mail.google.com/mail/#inbox/${this.id}`
        },
        labels: function() {
            if (!this.thread || !this.allLabels) { return null }
            let labelIds = this.thread.labelIds
            if (!labelIds) { labelIds = [] }
            labelIds = labelIds.concat(
                this.thread.messages.flatMap(message => message.labelIds)
            )
            labelIds = Array.from(new Set(labelIds))
            return labelIds.map(labelId => this.allLabels.find(label => label.id == labelId))
        },
    },
    asyncComputed: {
        thread: async function() {
            return this.$gapi.query(
                `thread ${this.id}`,
                client => client.gmail.users.threads.get({ userId: this.$gapi.userId, id: this.id, format: 'metadata' }),
                result => result,
            )
        }
    },
    components: { Label }
}
</script>