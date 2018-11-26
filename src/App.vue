<template>
    <div>
      <router-view></router-view>
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

export default {
    name: 'app',
    props: {
        pages: Array
    },
    router,
}
</script>
