<template>
  <div :class="[B()]">
    <h-topbar :title="title"></h-topbar>

    <div v-if="content" :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="control" :class="[B('__control')]">
          <div>
            <monitor--circle :content="content"></monitor--circle>
            <monitor--chartLine :content="content"></monitor--chartLine>
            <monitor--list-message type="app-control" :content="content"></monitor--list-message>
          </div>
        </div>
        <div ref="message" :class="[B('__message')]">
          <monitor--list-message type="app" :content="content"></monitor--list-message>
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
  name: 'page-monitor-app-content',
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '监控信息', key: 'control' },
        { name: '基本信息', key: 'message' },
        { name: '告警日志', key: 'logs' }
      ],
      content: null as any,
      appId: 0,
      intervalId: 0
    };
  },
  computed: {
    title(): string {
      return this.content?.name || '';
    }
  },
  created() {
    let { app_id } = this.$route.params;
    this.appId = Number(app_id) || 0;
    this.tabKey = this.navItems[0].key || '';
    this.init();

    this.intervalId = setInterval(() => {
      this.init();
    }, 5000);
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.intervalId);
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
      this.content = await this.$Model.Monitor.apps(this.appId);
    }
  }
});
</script>

<style lang="scss">
.page-monitor-app-content {
  position: relative;
  min-height: 100%;

  &__control {
    padding: 10px 15px;
    border-bottom: 10px solid #f4f6f9;
  }

  .monitor--list-message {
    h2 {
      display: none;
    }
    border-bottom: none;
  }
}
</style>
