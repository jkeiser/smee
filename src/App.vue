<template>
  <div>
    <sui-button
      social="google"
      icon="google"
      v-bind:loading="$gapi.signingInOrOut"
      v-bind:positive="shouldSignIn"
      v-on:click="shouldSignIn ? $gapi.signIn() : $gapi.signOut()"
      :content="shouldSignIn ? 'Sign In' : 'Sign Out'"
    />
    <sui-label v-bind:key="label.name" v-for="label in labels">{{label.name}}</sui-label>
    <!-- <router-view></router-view>
    -->
  </div>
</template>

<script>
/* eslint-disable no-console */
// //
// // Set up routes
// //
// import GoogleAuthenticator from './components/authenticator/GoogleAuthenticator.vue'
// import VueRouter from 'vue-router'
// import CaptainsLog from './components/CaptainsLog.vue'
// import EmailCabinet from './components/EmailCabinet.vue'
// import NotFound from './components/NotFound.vue'

// var router = new VueRouter({
//   mode: 'history',
//   routes: [
//     { path: '/', redirect: '/captainslog' },
//     { path: '/captainslog', component: CaptainsLog },
//     { path: '/emailcabinet', component: EmailCabinet },
//     ...GoogleAuthenticator.routes,
//     { path: '*', component: NotFound },
//   ]
// })

export default {
    name: 'app',
    computed: {
      shouldSignIn: function() { return !this.$gapi.isSignedIn },
    },
    asyncComputed: {
      emailClient: async function() {
        let client = await this.$gapi.client('https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest')
        return client.gmail
      },
      messages: async function() {
        if (this.emailClient == null) { return [] }
        return await this.emailClient.users.emails.list({'userId': 'me'})
      },
      labels: async function() {
        if (this.emailClient == null) { return [] }
        let response = await this.emailClient.users.labels.list({'userId': 'me'})
        console.log(response.result.labels)
        return response.result.labels
      }
    },
    // router
}
</script>
