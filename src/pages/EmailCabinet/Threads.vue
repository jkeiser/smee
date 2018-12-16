<template>
    <div class="ui items">
        <Thread v-for="thread in threads" :key="thread.id" v-bind="thread" :allLabels="allLabels" class="item" />
    </div>
</template>

<script>
import Thread from './Thread'

export default {
    props: { threads: Array, allLabels: Array },
    components: { Thread },
}
</script>