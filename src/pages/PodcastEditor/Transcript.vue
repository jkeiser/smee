<template>
  <table class="transcript">
    <TranscriptPart v-for="(part, index) in transcriptParts" :key="index" :speaker="part.speaker" :words="part.words" />
  </table>
</template>

<script>
import TranscriptPart from './TranscriptPart'
export default {
  props: {
    transcripts: Array
  },
  data: function() {
    return {
      speakers: {
        '1': 'Chauncy',
        '2': 'John',
      }
    }
  },
  components: {
    TranscriptPart
  },
  computed: {
    transcriptParts: function() {
      if (!this.transcripts) {
        return []
      }
      let parts = []

      // Go through the transcript parts one by one, and 
      let nextPart = null
      for (let transcript of this.transcripts.map(this.topAlternative)) {
        for (let transcriptWord of transcript['words']) {
          // HACK. Google seems to transcribe the entire thing twice when you
          // allow speaker tags ... so we ignore the one without speaker tags.
          if (!transcriptWord['speakerTag']) {
            continue
          }

          // Make a new part if the speaker changes.
          let speaker = this.speakers[transcriptWord['speakerTag']]
          if (nextPart && speaker != nextPart.speaker) {
            parts.push(nextPart)
            nextPart = null
          }

          // Add the word to the current part
          let word = {
            word: transcriptWord['word'],
            startTime: this.parseTime(transcriptWord['startTime']),
            endTime: this.parseTime(transcriptWord['endTime']),
            confidence: transcriptWord['confidence']
          }
          if (!nextPart) {
            nextPart = { speaker, words: [] }
          }
          nextPart.words.push(word)

          // Start a new part after 30 seconds.
          if ((word.startTime - nextPart.words[0].startTime) > 30) {
            // Wait until a sentence break, though!
            if (word.word.endsWith('.') || word.word.endsWith('!') || word.word.endsWith('?')) {
              parts.push(nextPart)
              nextPart = null
            }
          }
        }
      }

      // Push the very last result
      if (nextPart) {
        parts.push(nextPart)
      }

      return parts
    },
  },
  methods: {
    topAlternative: function(transcript) {
      let result = null
      for (let alternative of transcript['alternatives']) {
        if (result == null || alternative['confidence'] > result['confidence']) {
          result = alternative
        }
      }
      return result
    },
    parseTime: function(time) {
      return parseFloat(time.substring(0, time.length - 1))
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.transcript {
  border: 1px solid black
}
</style>
