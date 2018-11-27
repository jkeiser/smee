<template>
    <div class="ui compact attached segment">
        <a class="ui ribbon tiny label">{{ time() }}</a>{{ text }}
    </div>
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
