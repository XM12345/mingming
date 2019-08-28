<template>
  <div class="page-weibo">
    <h-topbar title="微博文稿">
      <router-link to="/search/weibo"></router-link>
    </h-topbar>
    <div class="page-weibo-main">
      <header>
        <div
          class="s-columns"
          @click="isColSpread = ! isColSpread,isStatusSpread=false, spreadData = columns"
        >
          <span :class="{active: isColSpread}">{{columnName || '所有公众号'}}</span>
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
        <weibo--list-article :account="col" :state="status"></weibo--list-article>
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
      isColSpread: false,
      isStatusSpread: false,
      columns: [],
      columnName: null,
      col: undefined,
      allStatus: [
        { name: '审核中', value: 1 },
        { name: '已通过', value: 2 },
        { name: '已发布', value: 3 }
      ],
      statusName: null,
      status: '',
      spreadData: []
    };
  },
  created() {
    this.$Model.Weibo.accounts().then(data => {
      this.columns = data;
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
.page-weibo {
  height: 100%;
  background-color: #f4f6f9;
  &-main {
    position: absolute;
    top: 41px;
    bottom: 0;
    width: 100%;

    header {
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
