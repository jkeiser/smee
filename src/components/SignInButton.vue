<template>
    <!-- Signed in: show profile picture and dropdown card with profile info + sign out button -->
    <!-- Signing out: show profile picture, with spinner -->
    <div v-if="gapi.isSignedIn" class="ui simple pointing top right dropdown" :class="{loading: gapi.isBusy}">
        <img v-if="gapi.basicProfile.imageUrl" class="ui fluid circular image" :src="gapi.basicProfile.imageUrl" />
        <i v-else class="ui fluid fitted circular google icon" />
        <div class="ui menu">
            <img class="ui tiny image" :src="gapi.basicProfile.imageUrl" />
            <div class="ui segment">{{ gapi.basicProfile.email }}</div>
            <div class="ui button" :class="{loading: gapi.isBusy, disabled: gapi.isBusy}" @click="gapi.signOut()">Sign Out</div>
        </div>
    </div>

    <!-- Signed out: show Google icon, highlighted ("positive"), and sign in on click -->
    <!-- Signing in: show Google icon, with spinner, disabled -->
    <!-- Initializing: show Google icon, with spinner, disabled -->
    <!-- TODO don't show spinner while initializing unless it takes forever -->
    <i v-else class="ui fluid fitted circular google icon button" :class="{positive: !gapi.isBusy, disabled: gapi.isBusy, loading: gapi.isBusy }" @click="gapi.signIn()" />
</template>

<style>
/* Add fluid to fitted icons so we can get 100% size */
i.fluid.fitted.icon { width: 100% !important; height: 100% !important }
</style>

<script>
export default {
    computed: {
        gapi: function() { return this.$gapi },
    },
}
</script>