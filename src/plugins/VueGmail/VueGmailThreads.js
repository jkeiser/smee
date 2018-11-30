import { getFields, buildQueryParams } from './getfields'
import Vue from 'vue'

// TODO infer all this from the discovery doc
export default {
    Threads: Vue.extend({
        props: {
            userId: String,
            includeSpamTrash: Boolean,
            labelIds: String,
            maxResults: Number,
            pageToken: String,
            q: String,
        },
        computed: {
            threads: function() {
                if (!(this.response && this.response.result)) { return null }
                return this.response.result.threads.map(thread => new this.Thread({ propData: { userId: this.userId, listedThread: thread }}))
            },
            queryParams: buildQueryParams,
        },
        asyncComputed: {
            response: async function() {
                return await this.$gapi.query('listing labels', client => client.gmail.users.threads.list(this.queryParams))
            },
        },
    }),
    Thread: Vue.extend({
        props: {
            userId: String,
            knownData: Object,
        },
        computed: getFields(
            'id',
            'name',
            'messageListVisibility',
            'labelListVisibility',
            'type',
            'messagesTotal',
            'messagesUnread',
            'threadsTotal',
            'threadsUnread',
            'color'
        ).merge({
            queryParams: buildQueryParams,
        }),
        asyncComputed: {
            result: function() {
                this.response.result
            },
            response: async function() {
                return await this.$gapi.query('getting label', client => client.gmail.users.labels.get(this.queryParams))
            },
        },
    }),
}