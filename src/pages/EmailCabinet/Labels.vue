<template>
    <div>
        <Label v-for="label in labels" :key="label.id" v-if="label.labelListVisibility != 'labelHide'" :name="label.name" />
    </div>
</template>

<script>
import Label from './Label'
export default {
    components: { Label },
    asyncComputed: {
        labels: async function() {
            return []
            // let response = await this.$gapi.query('listing labels', client => client.gmail.users.labels.list({'userId': 'me','fields': 'labels(id,name,labelListVisibility)'}))
            // return response.result.labels
        }
    },
}
</script>