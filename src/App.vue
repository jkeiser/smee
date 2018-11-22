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


const pages = [ CaptainsLog, EmailCabinet ]

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: pages[0].data().path },
    ...pages.map(page => ({ path: page.data().path, component: page })),
    { path: '*', component: NotFound },
  ]
})

import SignInButton from './components/SignInButton.vue'

export default {
    name: 'app',
    components: { SignInButton },
    created: function() {
      this.$root.pages = pages
    },
    router,
}
</script>
