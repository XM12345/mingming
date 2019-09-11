<template>
  <div class="page-message-task">
    <h-topbar title="任务消息设置"></h-topbar>
    <div class="s-main">
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch" listenScroll="false">
        <user--list-task :activeKey="tabKey"></user--list-task>
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
        { name: '素材库', key: 'media' },
        { name: '协同任务', key: 'task' },
        { name: '电视文稿', key: 'doc' },
        { name: '选题', key: 'subject' }
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
