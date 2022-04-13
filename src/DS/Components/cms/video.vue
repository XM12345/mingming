<template>
  <div :class="[B()]">
    <h-video v-if="video" controls :video="video"></h-video>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'cms--video',
  props: {
    extension: { required: true, type: Object, default: () => ({}) },
    baview_api_url: { required: true, type: String, default: '' }
  },
  data() {
    return {
      video: null
    };
  },
  created() {
    let { video_id } = this.extension;
    if (video_id) {
      this.$Model
        .Cms(this.baview_api_url)
        .videos(video_id)
        .then(data => {
          let video = data[0];
          console.log({ video });
          if (video) {
            this.video = video;
          } else {
            this.$toast('视频不存在');
          }
        });
    }
  }
});
</script>

<style lang="scss">
.cms--video {
  video {
    max-height: 100vw;
    min-height: 56vw;
    width: 100%;
    display: block;
    background: #000;
  }
}
</style>
