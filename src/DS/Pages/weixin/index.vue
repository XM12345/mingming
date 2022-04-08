<template>
  <div :class="[B()]">
    <h-topbar title="微信文稿">
      <h-link v-if="col && columnName" class="h-topbar-search" :to="`/weixin/search/${col}/${columnName}`"></h-link>
    </h-topbar>

    <div :class="[B('__select')]">
      <base--selectbar v-if="selectBar.length" :selectBar="selectBar" @select="select"></base--selectbar>
    </div>
    <weixin--list-tuwen v-if="col" :accountId="col" :status="status"></weixin--list-tuwen>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weixin-index',
  data() {
    return {
      columnName: '所有公众号',
      col: undefined as number | undefined,
      status: -1,
      allStatus: [
        { name: '全部', value: -1 },
        { name: '草稿', value: 0 },
        { name: '待审', value: 9 },
        { name: '已通过', value: 10 },
        { name: '已发布', value: 12 },
        { name: '发布失败', value: 13 }
      ],
      selectBar: [] as any[]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let accounts = await this.$Model.Weixin.accounts();
      if (accounts.length) {
        this.col = accounts[0].id;
        this.columnName = accounts[0].name;
        this.selectBar = [
          { type: 'noraml', returnWord: 'col', value: this.col, valueName: this.columnName, list: accounts },
          { type: 'normal', returnWord: 'status', value: -1, valueName: '所有状态', list: this.allStatus }
        ];
      }
    },
    select(item: any) {
      switch (item.type) {
        case 'col':
          this.col = item.id;
          this.columnName = item.name;
          break;
        case 'status':
          this.status = item.value;
          break;
        default:
          break;
      }
    }
  }
});
</script>

<style lang="scss">
.page-weixin-index {
  min-height: 100%;
  background-color: #f4f6f9;

  &__select {
    height: 51px;
    .h-selectbar {
      position: fixed;
      width: 100%;
      top: 41px;
      background-color: #f9f9f9;
      z-index: 999;
    }
  }
}
</style>
