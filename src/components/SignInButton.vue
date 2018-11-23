<template>
    <!-- if we're loading, signing in or signing out, show a placeholder or deemphasized image -->
    <!-- <div :class="{placeholder: $gapi.inProgress}"> -->
            <sui-button class="SignInButton" circular :disabled="$gapi.inProgress" @click="$gapi.isSignedIn ? $gapi.signOut() : $gapi.signIn()" :loading="$gapi.inProgress">
                <sui-image v-if="$gapi.basicProfile.imageUrl" circular centered :src="$gapi.basicProfile.imageUrl" />
            </sui-button>
    <!-- </div> -->
</template>

<style>
.SignInButton {
    margin: 0px !important;
    padding: 0px !important; 
    width: 3rem;
    height: 3rem;
}
.SignInButton img {
    margin: 0px;
    padding: 0px; 
    width: 3rem;
    height: 3rem;
}
</style>


<script>
/* eslint-disable no-console */
export default {
}
</script>