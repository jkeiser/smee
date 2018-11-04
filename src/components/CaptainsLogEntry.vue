<template>
    <sui-segment attached compact>
        <a class="ui ribbon tiny label">{{ time() }}</a>{{ text }}
    </sui-segment>
</template>

<script>
import moment from 'moment'
export default {
    name: 'CaptainsLogEntry',
    props: {
        timestamp: Date,
        text: String,
    },
    methods: { time() { return moment(this.timestamp).format('h:mm') } }
}
</script>
