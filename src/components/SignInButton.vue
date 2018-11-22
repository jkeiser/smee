<template>
        <sui-image
            avatar
            :src="$gapi.basicProfile.imageUrl"
            v-if="$gapi.basicProfile"
            floated="right"
            />
        <sui-button
            social="google"
            icon="google"
            :loading="$gapi.inProgress"
            :positive="$gapi.canSignIn"
            :content="$gapi.canSignOut ? 'Sign Out' : 'Sign In'"
            @click="$gapi.canSignOut ? $gapi.signOut() : $gapi.signIn()"
            floated="right"
            v-else
        />
</template>

<script>
/* eslint-disable no-console */
export default {
}
</script>