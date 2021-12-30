<template>
  <video
    v-if="rawSrc || !useMultiSource"
    :class="[B()]"
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
    :class="[B()]"
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

<script lang="ts">
import Vue from 'vue';
import type FlvJs from 'flv.js';
import type Hls from 'hls.js';
// 多版本视频播放器

export default Vue.extend({
  name: 'h-video',
  props: {
    video: { type: Object, default: () => ({}) },
    poster: { type: String, default: '' },
    rawSrc: { type: String, default: '' },
    /**
     * 为 false 时将使用src属性而不是source列表
     * source列表可以由浏览器选择视频版本，src可以动态切换视频源
     */
    useMultiSource: { type: Boolean, default: true }
  },
  data() {
    return Object.assign(
      {},
      {} as {
        $el: HTMLVideoElement;
        $_flv?: FlvJs.Player | null;
        $_hls?: Hls | null;
      }
    );
  },
  computed: {
    versions(): any {
      let { versions = [] } = this.video || {};
      if (versions[0] && versions[0].name == '源版本') {
        // 将源版本移动到最末尾
        versions.push(versions.shift());
      }
      return versions;
    },
    video_src(): string {
      if (this.rawSrc) {
        return this.rawSrc;
      }
      // 改用 source 列表由浏览器自己选择 2018年7月24日 16:26:49
      let { versions = [], cover_url } = this.video || {};
      if (!versions.length) {
        return '';
      }
      let version = versions.find(({ url }: any) => {
        return !!url.match(/.mp4(\?.*)?$/i);
      });
      if (!version) {
        version = versions.find(({ url }: any) => {
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
  },
  methods: {
    play() {
      this.$el.play();
    },
    pause() {
      this.$el.pause();
    },

    async createFlv(url: string) {
      console.log('开始创建flv播放器');
      this.destroyFlv();
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

    async createHls(src: string) {
      console.log('开始创建hls播放器');
      this.destroyHls();

      let { default: Hls } = await import(/* webpackChunkName: "hls" */ 'hls.js');
      if (!Hls.isSupported()) {
        return;
      }

      let hls = new Hls();
      this.$_hls = hls;
      hls.loadSource(src);
      hls.attachMedia(this.$el);
      this.$once('hook:beforeDestroy', () => {
        this.destroyHls();
      });

      console.log('已创建hls播放器');
    },

    destroyFlv() {
      if (this.$_flv) {
        this.$_flv.destroy();
        this.$_flv = null;
        console.log('已销毁flv播放器');
      }
    },

    destroyHls() {
      if (this.$_hls) {
        this.$_hls.destroy();
        this.$_hls = null;
        console.log('已销毁hls播放器');
      }
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
      let { networkState, NETWORK_NO_SOURCE, error } = $el;
      return networkState == NETWORK_NO_SOURCE || (error && error.code == error.MEDIA_ERR_SRC_NOT_SUPPORTED);
    },

    onPlay() {
      let { currentSrc } = this.$el;
      let version = this.versions.find((v: any) => v.url == currentSrc);
      console.log('h-video 当前视频播放版本: ', currentSrc, version);
    },
    onError() {
      console.log('媒体错误');
      this.detectVideoType();
    }
  }
});
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
