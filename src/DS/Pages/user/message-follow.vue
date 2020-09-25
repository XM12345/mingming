<template>
  <div class="page-message-follow">
    <base--topbar title="关注消息设置"></base--topbar>
    <div class="s-main">
      <user--list-control v-if="type == 'control'"></user--list-control>
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch" listenScroll="false" v-else>
        <user--list-control v-if="tabKey == 'control'"></user--list-control>
        <user--list-tree :activeKey="tabKey" v-else></user--list-tree>
      </base--tab>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabKey: '',
      type: '',
      navItems: [
        { name: '通稿库', key: 'clue' },
        { name: '选题', key: 'subject' },
        { name: '素材库', key: 'media' },
        { name: '电视文稿', key: 'doc' },
        { name: '播出', key: 'stream' },
        { name: '串联单', key: 'series' },
        { name: '运维监控', key: 'control' }
      ]
    };
  },
  created() {
    let { query } = this.$route;
    let { type } = query;
    this.type = type;
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
.page-message-follow {
  position: relative;
  min-height: 100%;
  background: #f7f7f7;
  .s-main {
    .items {
      height: 100%;
    }
  }
}
</style>
