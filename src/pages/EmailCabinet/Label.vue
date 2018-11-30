<template>
    <div class="ui label" :style="style">{{ name }}</div>
</template>

<script>
export default {
    props: {
        id: String,
        name: String,
        type: String,
        color: Object,
    },
    computed: {
        style: function() {
            if (this.color) {
                let { textColor, backgroundColor } = this.color
                return `color: ${textColor}; backgroundColor: ${backgroundColor}`
            }
        }
    },
}
</script>