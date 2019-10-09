<template>
  <div class="page-series">
    <h-topbar title="串联单">
      <router-link to="/search/series"></router-link>
    </h-topbar>
    <div class="page-series-main">
      <header>
        <div
          class="s-columns"
          @click="isColSpread = ! isColSpread,isStatusSpread=false, spreadData = columns"
          v-if="activeKey!='recycle' && activeKey != 'mine'"
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
        <ul class="header-dropdown" v-if="isColSpread ||isStatusSpread">
          <li
            v-for="item in spreadData"
            :key="item.value"
            @click="select(item)"
            v-if="isStatusSpread"
          >{{item.name}}</li>
          <doc--list-columns :tree="spreadData" v-if="isColSpread" @select="select"></doc--list-columns>
        </ul>
      </header>
      <div class="s-contents">
        <p class="s-contents-nodata" v-if="!seriesList.length"></p>
        <doc--list-series :col="col" :status="status" :activeKey="activeKey" @data="list"></doc--list-series>
      </div>
    </div>
    <h-footer :footerNavs="footerNavs" @switchTo="switchTo"></h-footer>
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
      allStatus: [{ name: '草稿', value: 0 }, { name: '待审', value: 9 }, { name: '通过', value: 10 }],
      footerNavs: [
        { name: '我的串联单', key: 'mine' },
        { name: '串联单库', key: 'list' },
        { name: '审核串联单', key: 'audit' },
        { name: '回收站', key: 'recycle' }
      ],
      pk: 'series.view',
      spreadData: []
    };
  },
  created() {
    // 子组件向父组件传递值
    this.list();
    this.activeKey = this.$route.query['key'] || this.footerNavs[0].key;
  },
  watch: {
    activeKey() {
      this.col = '';
      this.columnName = '';
      this.status = -1;
      this.statusName = '';
      this.pk = 'series.view';
      if (this.activeKey == 'audit') {
        this.status = 9;
        this.pk = 'series.audit';
      }

      if (this.activeKey == 'audit' || this.activeKey == 'list') {
        this.getColumns();
      }
    }
  },
  methods: {
    getColumns() {
      this.$Model.Doc.columns(this.pk).then(data => {
        this.columns = data.filter(item => !item.parent_id || item.parent_id == 0);
      });
    },
    list(value) {
      if (value) {
        this.seriesList = value;
      }
    },
    switchTo(key) {
      this.activeKey = key;
    },
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
.page-series {
  height: 100%;
  background-color: #f4f6f9;

  &-main {
    position: absolute;
    top: 41px;
    bottom: 54px;
    width: 100%;

    header {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      div {
        &.s-columns,
        &.s-status {
          display: inline-block;
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
  .s-footer {
    @each $img in mine, list, audit, recycle {
      span.s-#{$img} {
        background-image: url('../images/detail/#{$img}@2x.png');
        &.active {
          background-image: url('../images/detail/#{$img}-active@2x.png');
        }
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
