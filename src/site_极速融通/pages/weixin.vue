<template>
  <div class="page-weixin">
    <h-topbar title="微信文稿">
      <router-link :to="`/search/${col}/${columnName}`" v-if="col && columnName"></router-link>
    </h-topbar>
    <div class="page-weixin-main">
      <h-selectbar :columns="columns" :allStatus="allStatus" @select="select" v-if="columns.length"></h-selectbar>
      <div class="s-contents">
        <p class="s-contents-nodata" v-if="!col"></p>
        <weixin--list-tuwen :accountId="col" :status="status" v-if="col"></weixin--list-tuwen>
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
      ]
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
    }
  }
};
</script>

<style lang="scss">
.page-weixin {
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

      &-nodata {
        background: url('../images/detail/noContent@2x.png');
        height: 100%;
        margin: 0;
        background-repeat: no-repeat;
        background-size: 210px;
        background-position: center;
      }
    }
  }
}
</style>