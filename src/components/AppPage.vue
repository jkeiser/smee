<template>
    <!-- Container to give reasonable padding around the whole thing -->
    <div class="ui container">
        <!-- Stackable makes it (more) responsive -->
        <div class="ui massive top attached tabular menu">
            <!-- Header -->
            <div class="header item">Smee</div>

            <!-- Actual tabs -->
            <div class="menu">
                <router-link v-for="route in navRoutes" :key="route.name"
                    :to="route.name"
                    class="item" :class="{active: route.name == $route.name}"
                >
                    <i v-if="route.meta.nav.icon" :class="`ui ${route.meta.nav.icon} icon`"  />{{ route.meta.nav.title }}
                </router-link>
            </div>

            <!-- <div class="right aligned item">hi</div> -->
            <div class="right aligned massivesquare item">
                <SignInButton />
            </div>
        </div>
        <!-- The actual tab -->
        <div class="ui bottom attached segment"><slot /></div>
    </div>
</template>

<style>
/* TODO make this actually match the height / width of the container (whichever is larger) */
.massivesquare { width: 2.85714286em; height: 2.85714286em; padding: .464285715em !important; }
</style>

<script>
/* eslint-disable no-console */
import SignInButton from './SignInButton'
export default {
    components: { SignInButton },
    computed: {
        navRoutes: function() {
            // Get all routes with a navTitle
            console.log(this.$route)
            let navRoutes = this.$router.options.routes
                .filter(route => route.name && route.meta && route.meta.nav)
            console.log(navRoutes)
            return navRoutes
        },
    },
}
</script>