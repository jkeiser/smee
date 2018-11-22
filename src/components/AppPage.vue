<template>
    <sui-container>
        <sui-menu>
            <sui-menu-item header content="Smee" />
            <a is="sui-menu-item" v-for="page in $root.pages" :key="page.data().title" :href="page.data().path" :icon="page.data().icon" :content="page.data().title" :active="$parent.path == page.data().path"/>
            <sui-menu-item position="right"><SignInButton /></sui-menu-item>
        </sui-menu>
        <sui-segment vertical><slot /></sui-segment>
    </sui-container>
</template>

<script>
/* eslint-disable no-console */
export default {
    mounted: function() { console.log(this.$parent.path) }
}
</script>