<template>
  <div class="page-weixin">
    <base--topbar title="微信文稿">
      <router-link :to="`/search/${col}/${columnName}`" v-if="col && columnName"></router-link>
    </base--topbar>

    <div class="s-select">
      <base--selectbar :columns="columns" :allStatus="allStatus" @select="select" v-if="columns.length"></base--selectbar>
    </div>

    <p class="s-main-nodata" v-if="!total"></p>
    <weixin--list-tuwen :accountId="col" :status="status" @total="getTotal" v-if="col"></weixin--list-tuwen>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [],
      columnName: '所有公众号',
      seriesList: [],
      col: '',
      status: -1,
      statusName: '',
      allStatus: [
        { name: '全部', value: -1 },
        { name: '草稿', value: 0 },
        { name: '待审', value: 9 },
        { name: '已通过', value: 10 },
        { name: '已发布', value: 12 },
        { name: '发布失败', value: 13 }
      ],
      total: 0
    };
  },
  created() {
    this.$Model.Weixin.accounts().then(data => {
      this.columns = data;
      if (data.length) {
        this.col = data[0].id;
        this.columnName = data[0].name;
      }
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
.page-weixin {
  min-height: 100%;
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
