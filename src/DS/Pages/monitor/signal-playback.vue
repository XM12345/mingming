<template>
  <div :class="[B()]">
    <h-topbar title="回看"></h-topbar>
    <div :class="[B('__player')]">
      <h-video controls autoplay :src="video && video.playback_address"></h-video>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-monitor-signal-playback',
  data() {
    return {
      video: null as any | null,
      signalId: 0,
      index: 0,
      date: ''
    };
  },
  created() {
    let { signal_id, date, index } = this.$route.params;
    this.signalId = Number(signal_id) || 0;
    this.date = date;
    this.index = Number(index) || 0;
    this.init();
  },
  methods: {
    async init() {
      let playbacks = await this.$Model.Monitor.playbacks(this.signalId, this.date);
      this.video = playbacks?.find((item: any) => item.index === Number(this.index) - 1);
    }
  }
});
</script>

<style lang="scss">
.page-monitor-signal-playback {
  &__player {
    video {
      width: 100%;
      height: 56.25vw;
      background: #000;
    }
  }
}
</style>
