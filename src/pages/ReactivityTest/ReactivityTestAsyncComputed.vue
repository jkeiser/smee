<template>
<span>{{asyncWasChanged}}</span>
</template>

<script>
export default {
      asyncComputed: {
        asyncWasChanged: async function() {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return true
        }
      },
}
</script>
