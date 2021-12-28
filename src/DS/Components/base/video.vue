<template>
  <video
    v-if="rawSrc || !useMultiSource"
    class="h-video"
    playsinline
    x5-playsinline="true"
    webkit-playsinline
    controlslist="nodownload"
    :data-vid="video.id"
    :poster="$F.image(video_poster, 'L')"
    :src="video_src"
    @play="onPlay"
    @error="onError"
  ></video>
  <video
    v-else
    class="h-video"
    playsinline
    x5-playsinline="true"
    webkit-playsinline
    controlslist="nodownload"
    :data-vid="video.id"
    :poster="$F.image(video_poster, 'L')"
    @play="onPlay"
    @error="onError"
  >
    <source
      v-for="(item, index) in versions"
      :src="item.url"
      :data-version="`${item.name}_${item.width}X${item.height}_${(item.bitrate * 1000) | 0}kbps`"
      :key="index"
    />
  </video>
</template>

<script>
// 巴视云 多版本视频播放器

export default {
  name: 'h-video',
  props: {
    video: {
      type: Object,
      default: () => ({})
    },
    poster: {
      type: String,
      default: ''
    },
    rawSrc: {
      type: String,
      default: ''
    },
    useMultiSource: {
      type: Boolean,
      default: true
      /*
       * 为 false 时将使用src属性而不是source列表
       * source列表可以由浏览器选择视频版本，src可以动态切换视频源
       */
    }
  },

  computed: {
    versions() {
      let { versions = [] } = this.video || {};
      if (versions[0] && versions[0].name == '源版本') {
        // 将源版本移动到最末尾
        versions.push(versions.shift());
      }
      return versions;
    },
    video_src() {
      if (this.rawSrc) {
        return this.rawSrc;
      }
      // 改用 source 列表由浏览器自己选择 2018年7月24日 16:26:49
      let { versions = [], cover_url } = this.video || {};
      if (!versions.length) {
        return '';
      }
      let version = versions.find(({ url }) => {
        return !!url.match(/.mp4(\?.*)?$/i);
      });
      if (!version) {
        version = versions.find(({ url }) => {
          return !!url.match(/.m3u8(\?.*)?$/i);
        });
      }
      // bitrate,name,sample_rate,url
      let { url = '' } = version || versions[0] || {};
      return url;
    },
    video_poster() {
      let { cover_url, thumbnail_url } = this.video || {};
      return this.poster || cover_url || thumbnail_url;
    }
  },

  methods: {
    play() {
      this.$el.play();
    },
    pause() {
      this.$el.pause();
    },

    async createFlv(url) {
      console.log('开始创建flv播放器');
      if (this.$_flv) {
        this.destroyFlv();
      }
      let { default: flvjs } = await import(/* webpackChunkName: "flv" */ 'flv.js');
      let flvPlayer = flvjs.createPlayer({ type: 'flv', url });
      this.$_flv = flvPlayer;
      flvPlayer.attachMediaElement(this.$el);
      flvPlayer.load();
      this.$once('hook:beforeDestroy', () => {
        this.destroyFlv();
      });
      console.log('已创建flv播放器');
    },
    destroyFlv() {
      let flvPlayer = this.$_flv;
      if (flvPlayer) {
        flvPlayer.destroy();
        console.log('已销毁flv播放器');
      }
      this.$_flv = null;
    },

    async createHls(src) {
      console.log('开始创建hls播放器');
      if (this.$_hls) {
        this.destroyHls();
      }

      let { default: Hls } = await import(/* webpackChunkName: "hls" */ 'hls.js');
      if (!Hls.isSupported()) {
        return;
      }

      let hls = new Hls();
      this.$_hls = hls;
      hls.loadSource(src);
      hls.attachMedia(this.$el);
      // hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      //   this.$el.play();
      // });
      this.$once('hook:beforeDestroy', () => {
        this.destroyHls();
      });

      console.log('已创建hls播放器');
    },

    destroyHls() {
      let hls = this.$_hls;
      if (hls) {
        hls.detachMedia(this.$el);
        hls.destroy();
        console.log('已销毁hls播放器');
      }
      this.$_hls = null;
    },

    detectVideoType(src = '') {
      if (this.isMediaNotSupported()) {
        src = src || this.$el.currentSrc || '';
        if (/.m3u8(\?.*)?$/i.exec(src)) {
          console.log('原生播放器不支持的格式 hls', src);
          this.createHls(src);
        } else if (/.flv(\?.*)?$/i.exec(src)) {
          console.log('原生播放器不支持的格式 flv', src);
          this.createFlv(src);
        } else {
          console.log('原生播放器不支持的格式', src);
        }
      }
    },
    isMediaNotSupported() {
      let { $el } = this;
      let { error } = $el;
      return $el.networkState == $el.NETWORK_NO_SOURCE || (error && error.code == error.MEDIA_ERR_SRC_NOT_SUPPORTED);
    },

    onPlay() {
      let { currentSrc } = this.$el;
      let version = this.versions.find(v => v.url == currentSrc);
      console.log('h-video 当前视频播放版本: ', currentSrc, version);
    },
    onError() {
      console.log('媒体错误');
      this.detectVideoType();
    }
  },

  watch: {
    video: {
      immediate: true,
      handler() {
        setTimeout(() => {
          this.detectVideoType();
        }, 500);
      }
    },
    rawSrc(newVal, oldVal) {
      console.log(`${oldVal} => ${newVal}`);
      if (newVal) {
        this.detectVideoType(newVal);
      } else {
        // 如果地址为空，则销毁 hls
        this.destroyHls();
      }
    }
  }
};
</script>

<style lang="scss">
.h-video {
  background: #000;

  // 去掉下载按钮 chrome 54.0-57.0之间
  // video {
  //   &::-internal-media-controls-download-button {
  //     display: none;
  //   }
  //   &::-webkit-media-controls {
  //     &-enclosure {
  //       overflow: hidden;
  //     }
  //     &-panel {
  //       width: calc(100% + 30px);
  //     }
  //   }
  // }
}
</style>
