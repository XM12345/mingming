<template>
  <div class="page-weibo">
    <h-topbar title="微博文稿">
      <router-link to="/search/weibo"></router-link>
    </h-topbar>
    <div class="page-weibo-main">
      <h-selectbar :columns="columns" :allStatus="allStatus" @select="select" v-if="columns.length"></h-selectbar>
      <div class="s-contents">
        <weibo--list-article :account="col" :state="status"></weibo--list-article>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [],
      columnName: '所有公众号',
      col: '',
      allStatus: [
        { name: '全部', value: -1 },
        { name: '审核中', value: 1 },
        { name: '已通过', value: 2 },
        { name: '已发布', value: 3 }
      ],
      statusName: '',
      status: ''
    };
  },
  created() {
    this.$Model.Weibo.accounts().then(data => {
      this.columns = data;
      this.columns.unshift({ id: '', name: '所有公众号' });
    });
  },
  methods: {
    select(item) {
      if (item.id != undefined) {
        this.col = item.id;
        this.columnName = item.name;
      } else {
        this.status = item.value;
        this.statusName = item.name;
      }
    }
  }
};
</script>


<style lang="scss">
.page-weibo {
  height: 100%;
  background-color: #f4f6f9;
  &-main {
    position: absolute;
    top: 41px;
    bottom: 0;
    width: 100%;

    .s-contents {
      position: relative;
      width: 100%;
      height: calc(100% - 51px);
      overflow-y: auto;
    }
  }
}
</style>
