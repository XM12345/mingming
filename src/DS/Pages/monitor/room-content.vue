<template>
  <div class="page-room-content">
    <base--topbar :title="content.name"></base--topbar>
    <div class="s-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div class="s-control" ref="control">
          <monitor--list-message type="ups" :content="content" v-if="content.type == 'ups'"></monitor--list-message>
          <div v-if="content.type == 'detector'">
            <monitor--device-ib :content="content"></monitor--device-ib>
            <monitor--chartLine :content="content"></monitor--chartLine>
            <monitor--list-message type="detector" :content="content"></monitor--list-message>
          </div>
        </div>
        <div class="s-message" ref="message">
          <monitor--list-message type="room" :content="content" v-if="content.id"></monitor--list-message>
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
  },
  methods: {
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    },
    init() {
      //this.$Model.Monitor.rooms().then(data => {});
      let { params } = this.$route;
      let { room_id, device_id } = params;
      this.$Model.Monitor.roomDevices(room_id, device_id).then(data => {
        this.content = data;
      });
    }
  }
};
</script>

<style lang="scss">
.page-room-content {
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
