<template>
  <div class="page-signal-playback">
    <base--topbar title="回看"></base--topbar>
    <div class="page-signal-playback-video">
      <base--video controls autoplay :src="video && video.playback_address"></base--video>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      video: null as any | null
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let { signal_id, date, index } = this.$route.params;
      let playbacks = await this.$Model.Monitor.playbacks(signal_id, date);
      this.video = playbacks?.find((item: any) => item.index == Number(index) - 1);
    }
  }
});
</script>

<style lang="scss">
.page-signal-playback {
  &-video {
    video {
      width: 100%;
      height: 56.25vw;
      background: #000;
    }
  }
}
</style>
