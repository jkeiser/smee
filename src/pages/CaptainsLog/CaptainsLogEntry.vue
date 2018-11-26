<template>
    <sui-segment attached compact>
        <a class="ui ribbon tiny label">{{ time() }}</a>{{ text }}
    </sui-segment>
</template>

<script>
// Bring in moment.js
import moment from 'moment'

export default {
    name: 'CaptainsLogEntry',
    props: {
        timestamp: Date,
        text: String,
    },
    methods: {
        time: function() { return moment(this.timestamp).format('H:mm') }
    }
}
</script>
