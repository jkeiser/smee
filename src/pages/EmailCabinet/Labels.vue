<template>
    <div class="ui segment">
        <Label v-for="label in labels" :key="label.id" v-if="label.labelListVisibility != 'labelHide'" v-bind="label" />
    </div>
</template>

<script>
import Label from './Label'

function labelSort(a,b) {
    // Sort system tags above user tags
    if (a.type != b.type) {
        return a.type == 'system' ? -1 : 1
    }
    // If both are the same type, sort them by name
    return a.name.localeCompare(b.name)
}

export default {
    components: { Label },
    asyncComputed: {
        labels: async function() {
            return await this.$gapi.query(
                'listing labels',
                client => client.gmail.users.labels.list({'userId': this.$gapi.currentUser.id,'fields': 'labels(id,name,type,labelListVisibility,color)'}),
                result => result.labels.sort(labelSort)
            )
        }
    },
}
</script>