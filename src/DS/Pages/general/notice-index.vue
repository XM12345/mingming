<template>
  <div :class="[B()]">
    <h-topbar title="公告"></h-topbar>

    <div :class="[B('__main')]" :style="style">
      <general--list-notice v-if="activeType === 'index'"></general--list-notice>
      <general--list-manage-notice v-if="activeType === 'manage'"></general--list-manage-notice>
    </div>

    <h-navigation v-if="showManage" :activeType="activeType" :navigation="navigation" @switch="switchTo"></h-navigation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'page-general-notice-index',
  data() {
    return {
      activeType: '',
      showManage: false,
      navigation: [
        {
          text: '公告栏',
          type: 'index',
          icon: require('./_images/icon-index.png'),
          iconActive: require('./_images/icon-index-active.png')
        },
        {
          text: '公告管理',
          type: 'manage',
          icon: require('./_images/icon-manage.png'),
          iconActive: require('./_images/icon-manage-active.png')
        }
      ]
    };
  },
  computed: {
    style(): { 'padding-bottom': string } | undefined {
      return this.showManage ? { 'padding-bottom': '55px' } : undefined;
    }
  },
  created() {
    this.activeType = (this.$route.query as any)['type'] || this.navigation[0].type;
    this.getUserCurrent();
  },
  methods: {
    switchTo(type: string) {
      this.activeType = type;
      this.$setQuery({ type });
    },
    async getUserCurrent() {
      let userCurrent = await this.$Model.General.getUserCurrent();
      if (userCurrent) {
        let { front_permission } = userCurrent;
        this.showManage =
          front_permission.includes('front_notice_manage') || front_permission.includes('front_notice_audit');
      }
    }
  }
});
</script>

<style lang="scss">
.page-general-notice-index {
}
</style>
