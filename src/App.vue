<template>
    <sui-container>
        <h1 is="sui-header" class="center aligned" block><sui-icon name="book" />Captain's Log</h1>
        <CaptainsLog />
    </sui-container>
</template>

<script>
import CaptainsLog from './components/CaptainsLog.vue'
export default {
    name: 'app',
    components: { CaptainsLog }
}
</script>
