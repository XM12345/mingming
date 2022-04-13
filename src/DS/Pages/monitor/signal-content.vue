<template>
  <div :class="[B()]">
    <h-topbar :title="title"></h-topbar>

    <template v-if="content">
      <div :class="[B('__player')]">
        <h-video controls autoplay :src="content.stream_address"></h-video>
      </div>

      <div :class="[B('__main')]">
        <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
          <div ref="control" :class="[B('__control')]">
            <monitor--device-ib :content="content"></monitor--device-ib>
          </div>
          <div ref="message" :class="[B('__message')]">
            <monitor--list-message type="signal" :content="content"></monitor--list-message>
          </div>

          <div ref="logs" :class="[B('__logs')]">
            <monitor--list-logs :content="content"></monitor--list-logs>
          </div>
          <div ref="playback" :class="[B('__playback')]">
            <monitor--signal-playbacks :content="content"></monitor--signal-playbacks>
          </div>
        </h-tab>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-monitor-signal-content',
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '监控信息', key: 'control' },
        { name: '基本信息', key: 'message' },
        { name: '告警日志', key: 'logs' },
        { name: '信号回看', key: 'playback' }
      ],
      content: null as any,
      signalId: 0
    };
  },
  computed: {
    title(): string {
      return this.content?.name || '';
    }
  },
  created() {
    let { signal_id } = this.$route.params;
    this.signalId = Number(signal_id) || 0;

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
    onSwitch(key: string) {
      this.tabKey = key;
      this.$nextTick(() => {
        (this.$refs[key] as any).scrollIntoView();
      });
    },
    async init() {
      this.content = await this.$Model.Monitor.signals(this.signalId);
    }
  }
});
</script>

<style lang="scss">
.page-monitor-signal-content {
  position: relative;
  min-height: 100%;

  &__player {
    video {
      width: 100%;
      height: 56.25vw;
      background: #000;
    }
  }
  &__main {
    position: absolute;
    width: 100%;
    top: calc(56.25vw + 41px);
    bottom: 0;
  }

  &__control {
    padding: 0 15px;
    border-bottom: 10px solid #f4f6f9;
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
