<template>
  <div :class="[B()]">
    <h-topbar :title="title"></h-topbar>

    <div v-if="content" :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="control" :class="[B('__control')]">
          <monitor--list-message v-if="content.type === 'ups'" type="ups" :content="content"></monitor--list-message>
          <div v-if="content.type === 'detector'">
            <monitor--device-ib :content="content"></monitor--device-ib>
            <monitor--chartLine :content="content"></monitor--chartLine>
            <monitor--list-message type="detector" :content="content"></monitor--list-message>
          </div>
        </div>
        <div ref="message" :class="[B('__message')]">
          <monitor--list-message type="room" :content="content"></monitor--list-message>
        </div>

        <div ref="logs" :class="[B('__logs')]">
          <monitor--list-logs :content="content"></monitor--list-logs>
        </div>
      </h-tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-monitor-room-content',
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '监控信息', key: 'control' },
        { name: '基本信息', key: 'message' },
        { name: '告警日志', key: 'logs' }
      ],
      content: null as any,
      roomId: 0,
      deviceId: 0
    };
  },
  computed: {
    title(): string {
      return this.content?.name || '';
    }
  },
  created() {
    let { room_id, device_id } = this.$route.params;
    this.roomId = Number(room_id) || 0;
    this.deviceId = Number(device_id) || 0;
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
      this.content = await this.$Model.Monitor.roomDevices(this.roomId, this.deviceId);
    }
  }
});
</script>

<style lang="scss">
.page-monitor-room-content {
  position: relative;
  min-height: 100%;

  .s-main {
    .s-control {
      padding: 10px 15px;
      border-bottom: 10px solid #f4f6f9;
      .monitor--list-message {
        h2 {
          display: none;
        }
        border-bottom: none;
      }
    }
  }
}
</style>
