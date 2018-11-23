<template>
    <div>
      <router-view></router-view>
    </div>
</template>

<script>
/* eslint-disable no-console */
//
// Set up components
//
import CaptainsLog from './CaptainsLog'
import EmailCabinet from './EmailCabinet'

//
// Set up routes
//
import VueRouter from 'vue-router'
import NotFound from './NotFound'

var router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/captainslog',
        },
        {
            path: '/captainslog',
            component: CaptainsLog,
            meta: {
                nav: {
                    title: 'Captain\'s Log',
                    icon: 'book',
                }
            }
        },
        {
            path: '/emailcabinet',
            component: EmailCabinet,
            meta: {
                nav: {
                    title: 'Email Cabinet',
                    icon: 'anchor',
                }
            },
        },
        { path: '*', component: NotFound },
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
