<template>
    <!-- Initializing: for first 500ms, show blank icon, no spinner, disabled -->
    <i v-if="!gapi.isInitialized && $pageLoad.delayedBy(500)" class="ui disabled fluid fitted circular icon button`" />

    <!-- Signed in: show profile picture and dropdown card with profile info + sign out button -->
    <!-- Signing out: show profile picture, with spinner -->
    <div v-else-if="gapi.isSignedIn" class="ui simple top left dropdown" :class="{loading: gapi.isBusy}">
        <img v-if="gapi.basicProfile.imageUrl" class="ui fluid circular image" :src="gapi.basicProfile.imageUrl" />
        <i v-else class="ui fluid circular google icon" />

        <!-- actual dropdown -->
        <div class="ui menu">
            <img class="ui tiny image" :src="gapi.basicProfile.imageUrl" />
            <div class="ui segment">{{ gapi.basicProfile.email }}</div>
            <div class="ui button" :class="{loading: gapi.isBusy, disabled: gapi.isBusy}" @click="gapi.signOut()">Sign Out</div>
        </div>
    </div>

    <!-- Signing in or initializing: show Google icon, with spinner, disabled -->
    <i v-else-if="gapi.isBusy" class="ui loading disabled fluid fitted circular google icon button`" />

    <!-- Signed out: show Google icon, highlighted ("positive"), and sign in on click -->
    <i v-else class="ui positive fluid fitted circular google icon button`" @click="gapi.signIn()" />
</template>

<style>
/* Add fluid icon to take up 100% of the space */
i.ui.fluid.icon { width: 100% !important; height: 100% !important; padding: 0px; }
div.ui.top.left.dropdown .menu { right: 0; left: auto; }
</style>

<script>
export default {
    computed: {
        gapi: function() { return this.$gapi },
    },
}
</script>