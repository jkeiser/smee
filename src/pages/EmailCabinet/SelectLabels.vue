<template>
    <div class="ui segment SelectLabelGrid">
        <div v-for="label in sortedLabels" :key="label.id" class="ui toggle checkbox">
            <input type="checkbox" v-model="label.selected" />
            <label><Label v-bind="label" /></label>
        </div>
    </div>
</template>

<style>
.SelectLabelGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
</style>

<script>
import Label from './Label'

export default {
    props: { allLabels: Array },
    components: { Label },
    computed: {
        sortedLabels() {
            if (this.allLabels) {
                return this.allLabels.sort(this.labelSort)
            }
        }
    },
    methods: {
        labelSort: function(a,b) {
            // Sort user tags above system tags
            if (a.type != b.type) {
                return a.type == 'system' ? 1 : -1
            }
            // If both are the same type, sort them by name
            return a.name.localeCompare(b.name)
        },
    }
}
</script>