<template>
  <div :class="[B()]">
    <h-topbar title="微博文稿">
      <h-link class="h-topbar-search" to="/weibo/search"></h-link>
    </h-topbar>

    <div :class="[B('__select')]">
      <base--selectbar :selectBar="selectBar" @select="select" v-if="selectBar.length"></base--selectbar>
    </div>
    <weibo--list-article :account="col" :state="status"></weibo--list-article>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weibo-index',
  data() {
    return {
      columns: [],
      columnName: '所有公众号',
      col: undefined,
      allStatus: [
        { name: '全部', value: -1 },
        { name: '审核中', value: 1 },
        { name: '已通过', value: 2 },
        { name: '已发布', value: 3 }
      ],
      statusName: '',
      status: undefined,
      selectBar: []
    };
  },
  created() {
    let operation = 'article_select';
    this.$Model.Weibo.accounts(operation).then(data => {
      this.columns = data;
      this.columns.unshift({ id: '', name: '所有公众号' });
      this.selectBar = [
        { type: 'noraml', returnWord: 'col', value: '', valueName: '所有公众号', list: this.columns },
        { type: 'normal', returnWord: 'status', value: -1, valueName: '所有状态', list: this.allStatus }
      ];
    });
  },
  methods: {
    select(item) {
      switch (item.type) {
        case 'col':
          this.col = item.id;
          this.columnName = item.name;
          break;
        case 'status':
          this.status = item.value;
          this.statusName = item.name;
          break;
        default:
          break;
      }
    }
  }
});
</script>

<style lang="scss">
.page-weibo-index {
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
