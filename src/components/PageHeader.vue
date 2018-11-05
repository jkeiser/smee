<template>
    <h1 is="sui-header" block text-align="center"><sui-icon :name="icon" />{{ title }}</h1>
</template>

<script>
export default {
    name: 'PageHeader',
    props: {
        icon: String,
        title: String
    }
}
</script>