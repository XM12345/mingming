<template>
  <div class="page-signal-content">
    <h-topbar :title="content.name"></h-topbar>
    <div class="s-video">
      <h-video controls autoplay :src="content.stream_address"></h-video>
    </div>
    <div class="s-main">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div class="s-control" ref="control">
          <monitor--device-ib :content="content" v-if="content.id"></monitor--device-ib>
        </div>
        <div class="s-message" ref="message">
          <monitor--list-message type="signal" :content="content" v-if="content.id"></monitor--list-message>
        </div>

        <div class="s-logs" ref="logs">
          <monitor--list-logs :content="content" v-if="content.id"></monitor--list-logs>
        </div>
        <div class="s-playback" ref="playback">
          <monitor--signal-playbacks :content="content" v-if="content.id"></monitor--signal-playbacks>
        </div>
      </h-tab>
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
        { name: '告警日志', key: 'logs' },
        { name: '信号回看', key: 'playback' }
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
      });
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
