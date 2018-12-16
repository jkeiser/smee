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
            redirect: '/captainslog',
        },
        {
            path: '/test',
            component: () => import('./pages/ReactivityTest')
        },
        {
            name: 'captainslog',
            path: '/captainslog',
            component: () => import('./pages/CaptainsLog'),
            meta: {
                nav: {
                    title: 'Captain\'s Log',
                    icon: 'book',
                }
            }
        },
        {
            name: 'emailcabinet',
            path: '/emailcabinet',
            component: () => import('./pages/EmailCabinet'),
            meta: {
                nav: {
                    title: 'Email Cabinet',
                    icon: 'anchor',
                }
            },
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
