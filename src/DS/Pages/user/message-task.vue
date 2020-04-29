<template>
  <div class="page-message-task">
    <base--topbar title="任务消息设置"></base--topbar>
    <div class="s-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch" listenScroll="false">
        <user--list-task :activeKey="tabKey"></user--list-task>
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
        { name: '选题', key: 'subject' },
        { name: '素材库', key: 'media' },
        { name: '电视文稿', key: 'doc' },
        { name: '协同任务', key: 'task' },
        { name: '串联单', key: 'series' }
      ]
    };
  },
  created() {
    this.tabKey = this.navItems[0].key || '';
  },
  methods: {
    onSwitch(key) {
      this.tabKey = key;
    }
  }
};
</script>

<style lang="scss">
.page-message-task {
  position: relative;
  height: 100%;
  background: #f7f7f7;
}
</style>
