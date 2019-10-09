<template>
  <div class="page-weixin">
    <h-topbar title="微信文稿">
      <router-link :to="`/search/${col}/${columnName}`" v-if="col && columnName"></router-link>
    </h-topbar>
    <div class="page-weixin-main">
      <header class="s-header">
        <div
          class="s-columns"
          @click="isColSpread = ! isColSpread,isStatusSpread=false, spreadData = columns"
          v-if="activeKey!='recycle'"
        >
          <span :class="{active: isColSpread}">{{columnName || '所有栏目'}}</span>
          <mark :class="{active: isColSpread}"></mark>
        </div>
        <div
          class="s-status"
          @click="isStatusSpread = ! isStatusSpread,isColSpread=false,spreadData = allStatus"
        >
          <span :class="{active: isStatusSpread}">{{statusName || '所有状态'}}</span>
          <mark :class="{active: isStatusSpread}"></mark>
        </div>
        <ul class="header-dropdown" v-if="isColSpread || isStatusSpread">
          <li v-for="item in spreadData" :key="item.value" @click="select(item)">{{item.name}}</li>
        </ul>
      </header>
      <div class="s-contents">
        <p class="s-contents-nodata" v-if="!col"></p>
        <weixin--list-tuwen :accountId="col" :status="status" v-if="col"></weixin--list-tuwen>
      </div>
    </div>
    <div
      class="header-modal"
      v-if="isColSpread || isStatusSpread"
      @click="isStatusSpread = false,isColSpread=false"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeKey: '',
      columns: [],
      columnName: null,
      seriesList: [],
      col: '',
      status: -1,
      statusName: null,
      isColSpread: false,
      isStatusSpread: false,
      allStatus: [
        { name: '草稿', value: 0 },
        /* { name: '一审', value: 1 },
        { name: '二审', value: 2 },
        { name: '三审', value: 3 }, */
        { name: '待审', value: 9 },
        { name: '已通过', value: 10 },
        /*  { name: '入库', value: 11 }, */
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
      if (this.isColSpread) {
        this.col = item.id;
        this.columnName = item.name;
        this.isColSpread = !this.isColSpread;
      } else if (this.isStatusSpread) {
        this.status = item.value;
        this.statusName = item.name;
        this.isStatusSpread = !this.isStatusSpread;
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

    .s-header {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      div {
        display: inline-block;
        &.s-columns,
        &.s-status {
          span {
            color: #666;
            font-size: 15px;
            &.active {
              color: #1890ff;
            }
          }
          mark {
            display: inline-block;
            margin-left: 5px;
            border: 5px solid;
            background: none;
            border-color: #666 transparent transparent;
            transition: all 0.5s;
            &.active {
              transform: rotate(180deg) translate(0px, 3px);
              border-color: #1890ff transparent transparent;
            }
          }
        }
      }
      ul.header-dropdown {
        position: absolute;
        width: 100%;
        max-height: 60vh;
        overflow-y: auto;
        left: 0;
        top: 50px;
        z-index: 2000;
        background: #f9f9f9;
        li {
          padding: 15px;
          font-size: 15px;
        }
      }
    }
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
  .header-modal {
    position: absolute;
    width: 100%;
    top: 100px;
    bottom: 0;
    z-index: 500;
    background: #333;
    opacity: 0.7;
  }
}
</style>

