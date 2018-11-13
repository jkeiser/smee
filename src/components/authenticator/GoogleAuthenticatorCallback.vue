<template>
    <div>
        <sui-header is="h1">Authenticated</sui-header>
        <sui-loader active />
    </div>
</template>

<script>
export default {
    name: 'GoogleAuthenticatorCallback',
    props: {
        code: String,
        state: String,
    },
    created: function() {
        parent.postMessage({ code: this.code, state: this.state }, '*')
    }
}
</script>