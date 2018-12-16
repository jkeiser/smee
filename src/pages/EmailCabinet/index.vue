<template>
    <div>
        <SelectLabels :allLabels="allLabels" />
        <Threads :threads="threads" :allLabels="allLabels" />
    </div>
</template>

<script>
import SelectLabels from './SelectLabels'
import Threads from './Threads'

export default {
    components: { SelectLabels, Threads },
    asyncComputed: {
        allLabels: async function() {
            return await this.$gapi.query(
                'labels',
                client => client.gmail.users.labels.list({ userId: this.$gapi.userId }),
                result => {
                    let labels = result.labels
                    for (let label of labels) {
                        label.selected = true
                    }
                    // for (let label of labels) {
                    //     label.selected = (label.messageListVisibility == 'show' || label.name == 'INBOX' || label.name == 'SENT')
                    // }
                    // for (let label of labels) {
                    //     if (label.selected && label.name.includes('/')) {
                    //         let parentName = label.name.split('/')[0]
                    //         let parentLabel = labels.find(l => l.name == parentName)
                    //         if (parentLabel) {
                    //             label.selected = parentLabel.selected
                    //         }
                    //     }
                    // }
                    return labels
                }
            )
        },
        threads: async function() {
            let params = { userId: this.$gapi.userId }
            if (this.allLabels) {
                params.q = this.allLabels.filter(label => !label.selected).map(label => `-label:"${label.name}"`).join(" ")
            }
            return await this.$gapi.query(
                'threads',
                client => client.gmail.users.threads.list(params),
                result => result.threads
            )
        },
    },
}
</script>
