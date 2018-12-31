<template>
  <tr :class="`transcriptPart ${speaker}`">
    <td class="startTime">{{startTime}}</td>
    <td class="speaker">{{speaker}}:</td>
    <td class="words"><span v-for="(word, index) in words" :key="index" @click="playFrom(startTime)" class="word">{{word.word}} </span></td>
  </tr>
</template>

<script>
export default {
  props: {
    speaker: String,
    words: Array,
  },
  computed: {
    startTime: function() {
      let startTime = this.words[0].startTime
      var date = new Date(null)
      date.setSeconds(startTime)
      return date.toISOString().substr(11, 8).replace(/^0/, '').replace(/^0:/, '').replace(/^0/, '')
    },
  },
}
</script>

<style>
.transcriptPart td {
  border: 1px solid black;
  border-collapse: collapse;
}
.Chauncy {
  background-color: lightgray
}
.transcriptPart .speaker {
  font-weight: bold
}
</style>
