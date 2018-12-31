<template>
    <Transcript :transcripts="transcripts"/>
</template>

<script>
import Transcript from './Transcript'

export default {
  name: 'app',
  asyncComputed: {
    transcripts: {
      lazy: true,
      get: function() {
        return import('../../../../podcasty/podcast1.json').then(j => j.default['results'])
      }
    }
  },
  components: {
    Transcript
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
