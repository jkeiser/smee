<template>
    <div>
        <table>
            <tr><th>dataObject.wasChanged = true</th><td>{{dataObject.wasChanged}}</td></tr>
            <tr><th>dataObject.asyncWasChanged = true</th><td>{{dataObject.asyncWasChanged}}</td></tr>
            <tr><th>dataObject.secondLevel.wasChanged = true</th><td>{{dataObject.secondLevel.wasChanged}}</td></tr>
            <tr><th>dataObject.secondLevel.thirdLevel.wasChanged = true</th><td>{{dataObject.secondLevel.thirdLevel.wasChanged}}</td></tr>
            <tr><th>computedObject.wasChanged = true</th><td>{{computedObject.wasChanged}}</td></tr>
            <tr><th>computedObject.asyncWasChanged = true</th><td>{{computedObject.asyncWasChanged}}</td></tr>
            <tr><th>computedObject.secondLevel.wasChanged = true</th><td>{{computedObject.secondLevel.wasChanged}}</td></tr>
            <tr><th>computedObject.secondLevel.thirdLevel.wasChanged = true</th><td>{{computedObject.secondLevel.thirdLevel.wasChanged}}</td></tr>
            <tr><th>ReactivityTestAsyncComputed v-ref="hi"</th><td><ReactivityTestAsyncComputed ref="hi" /></td></tr>
            <tr><th>$refs.hi.asyncWasChanged = true</th><td>{{hiWasChanged}}</td></tr>
        </table>
        
    </div>
</template>

<script>
import Vue from 'vue'
import ReactivityTestAsyncComputed from './ReactivityTestAsyncComputed'

function createObjectThatWillChangeInOneSecond() {
    let c = Vue.extend({
      data: function() {
        let object = {
          wasChanged: false,
          secondLevel: {
              wasChanged: false,
              thirdLevel: {
                  wasChanged: false,
              }
          },
        }
        setTimeout(() => { object.wasChanged = object.secondLevel.wasChanged = object.secondLevel.thirdLevel.wasChanged = true }, 1000)
        return object
      },
      asyncComputed: {
        asyncWasChanged: async function() {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return true
        }
      },
    })
    let result = new c()
    // result.mount()
    return result
}
export default {
    components: { ReactivityTestAsyncComputed },
    data: function() {
        let c = Vue.extend(ReactivityTestAsyncComputed)
        return {
            dataObject: createObjectThatWillChangeInOneSecond(),
            programmaticComponent: new c()
        }
    },
    computed: {
        // account: function() { return GoogleAccountData(this.$gapi) },
        computedObject: function() {
            return createObjectThatWillChangeInOneSecond()
        },
        hiWasChanged: function() { return this.$refs.hi ? this.$refs.hi.asyncWasChanged : null }
    }
}
</script>
