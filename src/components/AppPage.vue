<template>
    <sui-container>
        <h1 is="sui-header" block text-align="center"><sui-icon :name="icon" />{{ title }}<SignInButton /></h1>
        <sui-segment vertical><slot /></sui-segment>
    </sui-container>
</template>

<script>
/* eslint-disable no-console */
export default {
    props: {
        icon: String,
        title: String
    },
    mounted: function() { console.warn("HI THERE")}
}
</script>