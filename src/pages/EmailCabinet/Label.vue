<template>
    <div class="ui label" :style="style">{{ finalName }}</div>
</template>

<script>
export default {
    props: {
        id: String,
        name: String,
        textColor: String,
        backgroundColor: String,
    },
    computed: {
        finalName: function() {
            if (this.name.startsWith('CATEGORY_')) {
                return this.name.substring('CATEGORY_'.length)
            } else {
                return this.name
            }
        },
        style: function() {
            return `color: ${this.textColor}; backgroundColor: ${this.backgroundColor}`
        }
    },
}
</script>