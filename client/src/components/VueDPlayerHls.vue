<template>
  <div class='dplayer' :options="options"></div>
</template>

<script>
import DPlayer from 'dplayer'
import '../../node_modules/dplayer/dist/DPlayer.min.css'

export default {
name: 'VueDPlayHls',
 props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      dp: null
    }
  },
  mounted() {
    this.options.container = this.$el
    const player = this.dp = new DPlayer(this.options)
    const events = player.events
    Object.keys(events).forEach(item => {
      if (item === 'events') {
        return false
      } else {
        events[item].forEach(event => {
          player.on(event, () => this.$emit(event))
        })
      }
    })
  }
  }
</script>
<style scoped>
  .dplayer{
      width: 100%;
      height: 100%;
  }
</style>