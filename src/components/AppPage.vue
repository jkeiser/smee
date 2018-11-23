<template>
    <sui-container>
        <sui-menu>
            <sui-menu-item header><h1>Smee</h1></sui-menu-item>
            <router-link v-for="route in navRoutes" :key="route.path"
                :to="route.path"
                is="sui-menu-item" :active="route == $route"
            >
                <sui-icon :name="route.meta.nav.icon" v-if="route.meta.nav.icon" />{{ route.meta.nav.title }}
            </router-link>
            <sui-menu-item position="right"><SignInButton /></sui-menu-item>
        </sui-menu>
        <sui-segment vertical><slot /></sui-segment>
    </sui-container>
</template>

<script>
/* eslint-disable no-console */
import SignInButton from './SignInButton'
export default {
    components: { SignInButton },
    computed: {
        navRoutes: function() {
            // Get all routes with a navTitle
            console.log(this.$route)
            return this.$router.options.routes
                .filter(route => route.meta && route.meta.nav)
        },
    },
}
</script>