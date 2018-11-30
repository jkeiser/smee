import AsyncComputed from 'vue-async-computed'

import VueGmailThreads from './VueGmailThreads'

export default {
    install(Vue) {
        Vue.use(AsyncComputed)
    },
    Threads: VueGmailThreads,
}