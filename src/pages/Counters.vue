<template>
    <div>
        <sui-segment color="red"><sui-button @click="raw.countUp()">Count Up Raw</sui-button><sui-label>{{ raw.count }}</sui-label></sui-segment>
        <sui-segment color="blue"><sui-button @click="component.countUp()">Count Up Component</sui-button><sui-label>{{ component.count }}</sui-label></sui-segment>
        <sui-segment color="green"><sui-button @click="rawProxy.countUp()">Count Up Raw Proxy</sui-button><sui-label>{{ rawProxy.count }}</sui-label></sui-segment>
        <sui-segment color="pink"><sui-button @click="componentProxy.countUp()">Count Up Component Proxy</sui-button><sui-label>{{ componentProxy.count }}</sui-label></sui-segment>
        <sui-segment color="black"><sui-button @click="$raw.countUp()">Count Up Global Raw</sui-button><sui-label>{{ $raw.count }}</sui-label></sui-segment>
    </div>
</template>

<script>
import Vue from 'vue'
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function RawCounter() {
    return {
      count: 0,
      async countUp() { await sleep(1000); this.count += 1 }
    }
}
function ComponentCounter(options) {
  let MyClass = Vue.extend({
    data: function() { return {
      count: 0
    } },
    methods: {
      countUp: async function() { await sleep(1000); this.count += 1 }
    }
  })
  return new MyClass(options)
}
function ProxyCounter(options) {
  let MyClass = Vue.extend({
    props: {
      counter: Object,
    },
    computed: {
      count: function() { return this.counter.count },
    },
    methods: {
      countUp: function() { this.counter.countUp() },
    }
  })
  return new MyClass(options)
}
Vue.prototype.$raw = RawCounter()
new Vue({data: function() { return Vue.prototype.$raw }})
export default {
  name: 'Counters',
  data: function() { return {
    raw: RawCounter(),
    component: ComponentCounter({ parent: this }),
    rawProxy: ProxyCounter({ propsData: { counter: RawCounter() } }),
    componentProxy: ProxyCounter({ propsData: { counter: ComponentCounter({ parent: this }) } }),
  } },
}
</script>