<template>
    <!-- Initializing: for first 500ms, show blank icon, no spinner, disabled -->
    <i v-if="isLoadingNormally" class="ui disabled fluid fitted circular icon button`" />

    <!-- Signed in: show profile picture and dropdown card with profile info + sign out button -->
    <!-- Signing out: show profile picture, with spinner -->
    <div v-else-if="isSignedIn" ref="dropdown" class="ui pointing top left dropdown" :class="{loading: isBusy}">
        <!-- avatar -->
        <img v-if="avatarUrl" class="ui fluid circular image" :src="avatarUrl" ref="avatar" :data-html="tooltip" />
        <i v-else class="ui fluid circular google icon" ref="avatar" :data-html="tooltip" />

        <!-- actual dropdown card -->
        <ProfileCard class="menu" />
    </div>

    <!-- Signing in or initializing: show Google icon, with spinner, disabled -->
    <i v-else-if="isBusy" class="ui loading disabled fluid fitted circular google icon button`" />

    <!-- Signed out: show sign in icon, highlighted ("positive"), and sign in on click -->
    <i v-else class="ui positive fluid fitted circular sign in icon button`" @click="signIn()" />
</template>

<style>
/* Add fluid icon to take up 100% of the space */
i.ui.fluid.icon { width: 100% !important; height: 100% !important; padding: 0px; }
</style>

<script>
import ProfileCard from './ProfileCard'
export default {
    components: { ProfileCard },
    computed: {
        isSignedIn: function() { return this.$gapi.isSignedIn },
        isLoadingNormally: function() { return !this.$gapi.isInitialized && !this.$pageLoad.delayedBy(500) },
        isBusy: function() { return this.$gapi.isBusy },

        avatarUrl: function() { return this.$gapi.currentUser.imageUrl },
        tooltip: function() {
            return `<b>${this.$gapi.currentUser.name}</b><br>${this.$gapi.currentUser.email}<br>Google Account`
        }
    },
    methods: {
        signIn: function() { return this.$gapi.signIn() },
        updateDropdown: function() {
            if (this.$refs.dropdown) {
                window.$(this.$refs.dropdown).dropdown()
                window.$(this.$refs.avatar).popup()
            }
        },
    },
    mounted: function() { this.updateDropdown() },
    updated: function() { this.updateDropdown() },
}
</script>