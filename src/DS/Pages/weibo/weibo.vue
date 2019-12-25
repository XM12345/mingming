<template>
  <div class="page-weibo">
    <base--topbar title="微博文稿">
      <router-link to="/search/weibo"></router-link>
    </base--topbar>

    <div class="s-select">
      <base--selectbar :columns="columns" :allStatus="allStatus" @select="select" v-if="columns.length"></base--selectbar>
    </div>

    <p class="s-main-nodata" v-if="!total"></p>
    <weibo--list-article :account="col" :state="status" @total="getTotal"></weibo--list-article>
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
      status: '',
      total: 0
    };
  },
  created() {
    let operation = 'article_select';
    this.$Model.Weibo.accounts(operation).then(data => {
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
    },
    getTotal(total) {
      this.total = total;
    }
  }
};
</script>

<style lang="scss">
.page-weibo {
  height: 100%;
  background-color: #f4f6f9;

  .s-select {
    height: 51px;
    .h-selectbar {
      position: fixed;
      width: 100%;
      top: 41px;
      background-color: #f9f9f9;
      z-index: 999;
    }
  }

  .s-main-nodata {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 210px;
    background: url('../doc/_images/noContent@2x.png');
    margin: 0;
    background-repeat: no-repeat;
    background-size: 210px;
    background-position: center;
  }
}
</style>
