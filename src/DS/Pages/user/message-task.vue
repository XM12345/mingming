<template>
  <div :class="[B()]">
    <h-topbar title="任务消息设置"></h-topbar>

    <div :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" listenScroll="false" @switch="onSwitch">
        <user--list-task :activeKey="tabKey"></user--list-task>
      </h-tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-user-message-task',
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '选题', key: 'subject' },
        { name: '素材库', key: 'media' },
        { name: '电视文稿', key: 'doc' },
        { name: '协同任务', key: 'task' },
        { name: '串联单', key: 'series' }
      ]
    };
  },
  created() {
    let { key } = this.$route.query;
    this.tabKey = String(key || '') || this.navItems[0].key || '';
  },
  methods: {
    onSwitch(key: string) {
      this.tabKey = key;
      this.$setQuery({ key });
    }
  }
});
</script>

<style lang="scss">
.page-user-message-task {
  position: relative;
  min-height: 100%;
  background: #f7f7f7;
}
</style>
