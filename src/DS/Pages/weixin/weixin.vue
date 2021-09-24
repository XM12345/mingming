<template>
  <div class="page-weixin">
    <base--topbar title="微信文稿">
      <base--link
        class="h-topbar-search"
        :to="`/weixin/search/${col}/${columnName}`"
        v-if="col && columnName"
      ></base--link>
    </base--topbar>

    <div class="s-select">
      <base--selectbar :selectBar="selectBar" @select="select" v-if="selectBar.length"></base--selectbar>
    </div>
    <weixin--list-tuwen :accountId="col" :status="status" v-if="col"></weixin--list-tuwen>
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
      selectBar: []
    };
  },
  created() {
    this.$Model.Weixin.accounts().then(data => {
      this.columns = data;
      if (data.length) {
        this.col = data[0].id;
        this.columnName = data[0].name;
        this.selectBar = [
          { type: 'noraml', returnWord: 'col', value: this.col, valueName: this.columnName, list: this.columns },
          { type: 'normal', returnWord: 'status', value: -1, valueName: '所有状态', list: this.allStatus }
        ];
      }
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
}
</style>
