<template>
    <sui-segment  raised>
        <CaptainsLogEntry v-for="entry in entries" :key="entry.id" v-bind="entry" />
        <sui-segment vertical>
            <sui-input icon="pencil" v-on:change="addMessage($event)" />
        </sui-segment>
    </sui-segment>
</template>

<script>
import CaptainsLogEntry from './CaptainsLogEntry.vue'

export default {
    name: 'CaptainsLog',
    data() { return { entries: [] } },
    methods: {
        addMessage(event) {
            var text = event.target.value
            if (text !== '') {
                event.target.value = ''
                this.entries.push({ timestamp: new Date(), text: text })
            }
        }
    },
    components: { CaptainsLogEntry },
}
</script>
