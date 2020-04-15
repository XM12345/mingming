<template>
  <div class="cms--video">
    <base--video controls :video="video" v-if="video"></base--video>
  </div>
</template>

<script>
export default {
  props: {
    extension: {
      required: true
    },
    baview_api_url: {
      required: true
    }
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
};
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
