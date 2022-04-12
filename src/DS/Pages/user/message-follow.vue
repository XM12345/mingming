<template>
  <div :class="[B()]">
    <h-topbar title="关注消息设置"></h-topbar>

    <div :class="[B('__main')]">
      <user--list-control v-if="type === 'control'"></user--list-control>
      <h-tab v-else :columns="navItems" :activeIndex="tabKey" listenScroll="false" @switch="onSwitch">
        <user--list-control v-if="tabKey === 'control'"></user--list-control>
        <user--list-tree v-else :activeKey="tabKey"></user--list-tree>
      </h-tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-user-message-follow',
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
    let { type } = this.$route.query;
    this.type = String(type || '');
    this.tabKey = this.navItems[0].key || '';
  },
  methods: {
    onSwitch(key: string) {
      this.tabKey = key;
    }
  }
});
</script>

<style lang="scss">
.page-user-message-follow {
  position: relative;
  min-height: 100%;
  background: #f7f7f7;
}
</style>
