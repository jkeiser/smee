<template>
    <sui-container>
        <sui-header is="h1">Immediate: {{ value }}, Delayed: {{ delayedValue }}, Delayed 2: {{ delayedValue }}</sui-header>
    </sui-container>
</template>

<script>
import PageHeader from './PageHeader.vue'

export default {
    name: 'EmailCabinet',
    components: { PageHeader },
    data: function() {
        return { value: 1 }
    },
    mounted: function() {
        console.log("mounted")
        this.$getGapiClient().then(gapi => {
            console.log("getting ...")
            console.log(gapi.sheets.spreadsheet.get("1uyM7qNaW13kcXIGbYENVJ8T-5E4pzkpDUIMHhyIIhIA"))
        })
    },
    asyncComputed: {
        delayedValue: {
            lazy: true,
            get: function() {
                let result = this.value
                return new Promise(resolve => {
                    console.log("Start " + result);
                    window.setTimeout(() => {
                        console.log("Finish " + result);
                        resolve("" + result)
                    }, 2000)
                })
            }
        }
    }
    // mounted: function() {
    //     this.gmail()
    // },
    // computed: {
    //     gmail: function() {
    //         this.$parent.authenticate([
    //             'https://www.googleapis.com/auth/gmail.readonly'
    //         ])
    //     }
    // }
}
</script>
