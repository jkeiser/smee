<template>
    <AppPage title="Email Cabinet">
        <Labels />
    </AppPage>
</template>

<script>
import Labels from './Labels.vue'

export default {
    data: function() {
        return {
            path: '/emailcabinet',
            title: 'Email Cabinet',
            icon: 'anchor',
        }
    },
    components: { Labels },
}
</script>
