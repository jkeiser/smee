<template>
    <div>
      <div class="ui search selection dropdown" ref="podcast">
        <input v-model="podcast" type="hidden" />
        <i class="file icon"></i>
        <i class="dropdown icon"></i>
        <div class="default text">Podcast Audio</div>
        <div class="menu">
          <div class="item" v-for="podcast in podcasts" :key="podcast.id" :data-value="podcast">{{podcast.name}}</div>
        </div>
      </div>
      <Transcript :transcripts="transcripts"/>
    </div>
</template>

<script>
import Transcript from './Transcript'

const MIME_TYPES = {
  'audio/flac': { encoding: 'FLAC' },
  'audio/x-flac': { encoding: 'FLAC' },
  'audio/l16': { encoding: 'LINEAR16' },
  'audio/basic': { encoding: 'MULAW' },
  'audio/amr': { encoding: 'AMR' },
  'audio/amr-wb': { encoding: 'AMR_WB' },
  'audio/ogg': { encoding: 'OGG_OPUS' },
  'audio/x-speex-with-header-byte': { encoding: 'SPEEX_WITH_HEADER_BYTE' },
}

export default {
  name: 'app',
  data: function() {
    return {
      podcast: null,
    }
  },
  watch: {
    podcasts: function(podcasts) {
      if (podcasts && this.podcast == null) {
        this.podcast = podcasts[0]
      }
    }
  },
  asyncComputed: {
    podcasts: async function() {
      let mimeTypes = Object.keys(MIME_TYPES)
      let params = {
        q: mimeTypes.map(mimeType => `mimeType = '${mimeType}'`).join(' or ')
      }
      return await this.$gapi.query(
          'audio files',
          client => client.drive.files.list(params),
          result => result.files
      )
    },

    transcripts: function() {
      if (this.podcast) {
        return import('../../../../podcasty/podcast1.json').then(j => j.default['results'])
      }
    },
  },
  components: {
    Transcript
  },
  mounted: function() { window.$(this.$refs.podcast).dropdown() },
  updated: function() { window.$(this.$refs.podcast).dropdown() },
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
