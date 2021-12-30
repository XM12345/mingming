<template>
  <div class="page-device-content">
    <h-topbar :title="content.name"></h-topbar>
    <div class="s-main">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div class="s-control" ref="control">
          <monitor--device-ib :content="content" v-if="content.type == 'ib'"></monitor--device-ib>
          <div v-if="content.type && content.type != 'ib'">
            <monitor--circle :content="content"></monitor--circle>
            <monitor--chartLine :content="content"></monitor--chartLine>
            <monitor--list-message type="app-control" :content="content"></monitor--list-message>
          </div>
        </div>
        <div class="s-message" ref="message">
          <monitor--list-message type="device" :content="content" v-if="content.id"></monitor--list-message>
        </div>

        <div class="s-logs" ref="logs">
          <monitor--list-logs :content="content" v-if="content.id"></monitor--list-logs>
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
        { name: '告警日志', key: 'logs' }
      ],
      DEVICE_TYPE: { server: '服务器', 'cloud-storage': '云存', switchboard: '交换机', ib: 'IB卡' },
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
      let { device_id } = params;
      //this.$Model.Monitor.deviceList().then(data => {});
      this.$Model.Monitor.devices(device_id).then(data => {
        this.content = data;
      });
    }
  }
};
</script>

<style lang="scss">
.page-device-content {
  position: relative;
  min-height: 100%;
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
</style>
