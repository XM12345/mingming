<template>
  <div class="page-message-follow">
    <h-topbar title="关注消息设置"></h-topbar>
    <div class="s-main">
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch" listenScroll="false">
        <user--list-tree :activeKey="tabKey"></user--list-tree>
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
        { name: '通稿库', key: 'clue' },
        { name: '电视文稿', key: 'doc' },
        { name: '选题', key: 'subject' },
        /* { name: '播出系统', key: 'system' } */
      ]
    };
  },
  created() {
    this.tabKey = this.navItems[0].key || '';
    //this.$Model.Doc.follow('doc').then(data => {});
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
  height: 100%;
  .s-main {
    position: absolute;
    width: 100%;
    top: 41px;
    bottom: 0;
  }
}
</style>
