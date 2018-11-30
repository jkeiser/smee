import buildComputedProperties from './getfields'
import Vue from 'vue'

// TODO infer all this from the discovery doc
export default {
    Labels: Vue.extend({
        props: {
            userId: String
        },
        computed: {
            labels: function() {
                if (!(this.response && this.response.result)) { return null }
                return this.response.result.labels.map(label => new this.Label({ propData: { userId: this.userId, listedLabel: label }}))
            }
        },
        asyncComputed: {
            response: async function() {
                return await this.$gapi.query('listing labels', client => client.gmail.users.labels.list({
                    'userId': this.userId || this.$gapi.currentUser.id
                }))
            },
        },
    }),
    Label: buildQueryComponent({
        props: {
            userId: String
        },
        resultFields: [
            'id',
            'name',
            'messageListVisibility',
            'labelListVisibility',
            'type',
            'messagesTotal',
            'messagesUnread',
            'threadsTotal',
            'threadsUnread',
            'color',
        ],
        resource: 'gmail.users.labels',
        method: 'get',
    }),
}