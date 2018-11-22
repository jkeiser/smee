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
import CaptainsLog from './CaptainsLog'
import EmailCabinet from './EmailCabinet'
// import TestPage from './components/TestPage'
import NotFound from './NotFound'

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/captainslog' },
    { path: '/captainslog', component: CaptainsLog },
    { path: '/emailcabinet', component: EmailCabinet },
    { path: '*', component: NotFound },
  ]
})

import SignInButton from './components/SignInButton.vue'

export default {
    name: 'app',
    components: { SignInButton },
    router,
}
</script>
