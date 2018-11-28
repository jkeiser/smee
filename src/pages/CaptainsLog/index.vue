<template>
    <div>
        <CaptainsLogEntry v-for="entry in entries" :key="entry.id" v-bind="entry" />
        <div class="ui vertical segment">
            <div class="ui icon input" @change="addMessage($event)">
                <input type="text" placeholder="Say what you care about ...">
                <i class="ui pencil icon" />
            </div>
        </div>
    </div>
</template>

<script>
import CaptainsLogEntry from './CaptainsLogEntry'

export default {
    data() {
        return {
            entries: [],
        }
    },
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
