<template>
  <div class="page-signal-content">
    <base--topbar :title="content.name"></base--topbar>
    <div class="s-video">
      <video controls autoplay :src="content.stream_address" ref="video"></video>
    </div>
    <div class="s-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div class="s-control" ref="control">
          <monitor--device-ib :content="content" v-if="content.id"></monitor--device-ib>
        </div>
        <div class="s-message" ref="message">
          <monitor--list-message type="signal" :content="content" v-if="content.id"></monitor--list-message>
        </div>

        <div class="s-logs" ref="logs">
          <monitor--list-logs :content="content" v-if="content.id"></monitor--list-logs>
        </div>
      </base--tab>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '监控信息', key: 'control' },
        { name: '基本信息', key: 'message' },
        { name: '告警日志', key: 'logs' }
      ],
      content: {}
    };
  },
  created() {
    this.tabKey = this.navItems[0].key || '';
    this.init();
    let tid = setInterval(() => {
      this.init();
    }, 5000);
    this.$once('hook:beforeDestroy', () => {
      clearInterval(tid);
    });
  },
  methods: {
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    },
    init() {
      let { params } = this.$route;
      let { signal_id } = params;
      //this.$Model.Monitor.singalList().then(data => {});
      this.$Model.Monitor.signals(signal_id).then(data => {
        this.content = data;

        /* 判断视频类型选择播放 */
        this.$nextTick(() => {
          this.detectVideoType(data.stream_address);
        });
      });
    },
    async createFlv(url) {
      console.log('开始创建flv播放器');
      if (this.$_flv) {
        this.destroyFlv();
      }
      let { default: flvjs } = await import(/* webpackChunkName: "flv" */ 'flv.js');
      let flvPlayer = flvjs.createPlayer({ type: 'flv', url });
      this.$_flv = flvPlayer;
      flvPlayer.attachMediaElement(this.$refs.video);
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
    detectVideoType(src = '') {
      if (this.isMediaNotSupported()) {
        src = src || this.$refs.video.currentSrc || this.$refs.video.src || '';
        if (/.flv(\?.*)?$/i.exec(src)) {
          console.log('原生播放器不支持的格式 flv', src);
          this.createFlv(src);
        } else {
          console.log('原生播放器不支持的格式', src);
        }
      }
    },
    isMediaNotSupported() {
      let { video } = this.$refs;
      let { error } = video;
      return (
        video.networkState == video.NETWORK_NO_SOURCE || (error && error.code == error.MEDIA_ERR_SRC_NOT_SUPPORTED)
      );
    }
  }
};
</script>

<style lang="scss">
.page-signal-content {
  position: relative;
  min-height: 100%;

  .s-video {
    video {
      width: 100%;
      height: 56.25vw;
      background: #000;
    }
  }
  .s-main {
    position: absolute;
    width: 100%;
    top: calc(56.25vw + 41px);
    bottom: 0;

    .s-control {
      padding: 0 15px;
      border-bottom: 10px solid #f4f6f9;
    }
  }
  .h-tab {
      &-nav {
        position: absolute;
        top: 0;
        border-top: none;
      }
    }
}
</style>
