<template>
  <div>
    <router-view></router-view>
    <GoogleAuthenticator ref="google"
      clientId="662782559552-gppt0aji4fop5bqndkdpah5epkfbcsnv.apps.googleusercontent.com"
      clientSecret="vUi_WGXf_06W3WZYl01qTZZo"
    />
  </div>
</template>

<script>
//
// Set up routes
//
import GoogleAuthenticator from './components/authenticator/GoogleAuthenticator.vue'
import VueRouter from 'vue-router'
import CaptainsLog from './components/CaptainsLog.vue'
import EmailCabinet from './components/EmailCabinet.vue'
import NotFound from './components/NotFound.vue'

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/captainslog' },
    { path: '/captainslog', component: CaptainsLog },
    { path: '/emailcabinet', component: EmailCabinet },
    ...GoogleAuthenticator.routes,
    { path: '*', component: NotFound },
  ]
})

export default {
    name: 'app',
    mounted: function() {
        console.log(this.$refs.google.client)
    },
    components: { GoogleAuthenticator },
    // methods: {
    //   authenticate: function(scopes) { return this.$refs.google.authenticate(scopes) }
    // },
    router
}
</script>
