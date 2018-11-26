import timing2 from 'timing2'
import Vue from 'vue'

export const LoadTimer = Vue.extend({
    props: {
        timeOrigin: Number,
    },
    data: function() {
        return {
            delayedByProps: {},
        }
    },
    methods: {
        now: function() {
            return Date.now() - this.timeOrigin
        },
        delayedBy: function(delayMs) {
            if (!this.delayedByProps.hasOwnProperty(delayMs)) {
                let currentDelay = this.now()
                let remainingTime = delayMs - currentDelay
                if (remainingTime > 0) {
                    this.$set(this.delayedByProps, delayMs, false)
                    setTimeout(() => { this.delayedByProps[delayMs] = true }, remainingTime)
                } else {
                    this.$set(this.delayedByProps, delayMs, false)
                }
            }
            return this.delayedByProps[delayMs]
        },
    },
})

export default {
    install(Vue) {
        Vue.mixin({
            computed: {
                $pageLoad: function() {
                    if (!this.$root.pageLoad) {
                        this.$root.pageLoad = new LoadTimer({
                            propsData: {
                                timeOrigin: timing2.timeOrigin
                            }
                        })
                    }
                    return this.$root.pageLoad
                }
            },
        })
    }
}