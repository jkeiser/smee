<template>
  <router-view></router-view>
</template>

<script>
//
// Set up routes
//
import VueRouter from 'vue-router'
import CaptainsLog from './components/CaptainsLog.vue'
import EmailCabinet from './components/EmailCabinet.vue'
import NotFound from './components/NotFound.vue'
var router = new VueRouter({
  routes: [
    { path: '/', redirect: '/captainslog' },
    { path: '/captainslog', component: CaptainsLog },
    { path: '/emailcabinet', component: EmailCabinet },
    { path: '*', component: NotFound }
  ]
})

export default {
    name: 'app',
    router
}
</script>
