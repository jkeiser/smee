<template>
    <div class="ui compact raised card">
        <div class="content">
            <div class="ui list">
                <div class="item">
                    <img class="ui circular image" :src="profileImageUrl" />
                    <div class="content">
                        <div class="header">{{ name }}</div>
                        <div class="meta">{{ email }}</div>
                        <div class="description">Google Account</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="extra content">
            <div class="ui right floated basic button" :class="{loading: signingOut, disabled: signingOut}" @click="signOut()">
                <i class="ui sign out icon" />
                Sign Out
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        profileImageUrl: function() { return this.$gapi.currentUser.imageUrl },
        name: function() { return this.$gapi.currentUser.name },
        email: function() { return this.$gapi.currentUser.email },
        signingOut: function() { return this.$gapi.isBusy },
    },
    methods: {
        signOut: function() { return this.$gapi.signOut() },
    }
}
</script>