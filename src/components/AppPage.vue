<template>
    <!-- Container to give reasonable padding around the whole thing -->
    <div class="ui container">
        <div class="ui massive top attached tabular menu">
            <!-- Title -->
            <div class="header item">Smee</div>

            <!-- Page Tabs -->
            <div class="menu">
                <router-link v-for="route in navRoutes" :key="route.name"
                    :to="route.name"
                    class="item" :class="{active: route.name == $route.name}"
                >
                    <i v-if="route.meta.nav.icon" :class="`ui ${route.meta.nav.icon} icon`"  />{{ route.meta.nav.title }}
                </router-link>
            </div>

            <!-- Sign in / profile button -->
            <div class="right aligned massivesquare item">
                <ProfileButton />
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
import ProfileButton from './ProfileButton'
export default {
    components: { ProfileButton },
    computed: {
        navRoutes: function() {
            // Get all routes with a navTitle
            return this.$router.options.routes
                .filter(route => route.name && route.meta && route.meta.nav)
        },
    },
}
</script>