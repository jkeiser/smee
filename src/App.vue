<template>
    <!-- Container to give reasonable padding around the whole thing -->
    <div class="ui container">
        <Navbar class="top attached" />

        <!-- The actual tab -->
        <div class="ui bottom attached segment">
            <router-view />
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */
//
// Set up routes
//
import VueRouter from 'vue-router'

var router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/captains-log',
        },
        {
            path: '/test',
            component: () => import('./pages/ReactivityTest')
        },
        {
            name: 'captains-log',
            path: '/captains-log',
            component: () => import('./pages/CaptainsLog'),
            meta: {
                nav: {
                    title: 'Captain\'s Log',
                    icon: 'book',
                }
            }
        },
        {
            name: 'email-cabinet',
            path: '/email-cabinet',
            component: () => import('./pages/EmailCabinet'),
            meta: {
                nav: {
                    title: 'Email Cabinet',
                    icon: 'anchor',
                }
            },
        },
        {
            name: 'podcast-editor',
            path: '/podcast-editor',
            component: () => import('./pages/PodcastEditor'),
            meta: {
                nav: {
                    title: 'Podcast',
                    icon: 'quote left',
                }
            }
        },
        { path: '*', component: () => import('./pages/NotFound') },
    ]
})

import Navbar from './components/Navbar'

export default {
    components: { Navbar },
    router,
}
</script>
