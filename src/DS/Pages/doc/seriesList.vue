<template>
  <div class="page-series">
    <base--topbar title="串联单">
      <router-link class="h-topbar-search" to="/series/search"></router-link>
    </base--topbar>

    <div class="s-select">
      <section class="h-selectbar">
        <header class="s-header">
          <div class="s-header-bars">
            <div @click="selectColumn" v-if="activeKey != 'recycle' && activeKey != 'mine'">
              <span :class="{ active: isColSpread }">{{ columnName }}</span>
              <mark :class="{ active: isColSpread }"></mark>
            </div>
            <div @click="selectStatus">
              <span :class="{ active: isStatusSpread }">{{ statusName }}</span>
              <mark :class="{ active: isStatusSpread }"></mark>
            </div>
          </div>
          <ul class="header-dropdown" v-if="isColSpread || isStatusSpread">
            <li
              :class="[item.value == status ? 'active' : '']"
              v-for="item in spreadData"
              :key="item.value"
              @click="select(item)"
              v-if="isStatusSpread"
            >
              {{ item.name }}
              <span v-if="item.value == status">√</span>
            </li>
            <doc--list-columns :tree="spreadData" v-if="isColSpread" @select="select"></doc--list-columns>
          </ul>
        </header>
        <div
          class="header-modal"
          v-if="isColSpread || isStatusSpread"
          @click="(isStatusSpread = false), (isColSpread = false)"
        ></div>
      </section>
    </div>

    <div class="page-series-main">
      <p class="s-main-nodata" v-if="!total"></p>
      <doc--list-series
        :col="col"
        :status="status"
        :activeKey="activeKey"
        @total="getTotal"
        v-if="['list', 'audit'].includes(activeKey) ? col : 'true'"
      ></doc--list-series>
      <router-link class="s-series-add" to="/series/add"></router-link>
    </div>

    <base--footer :footerNavs="footerNavs" @switchTo="switchTo"></base--footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeKey: '',
      columns: [],
      columnName: '所有栏目',
      col: undefined,
      status: -1,
      statusName: null,
      isColSpread: false,
      isStatusSpread: false,
      allStatus: [],
      listStatus: [
        { name: '全部', value: -1 },
        { name: '草稿', value: 0 },
        { name: '待审', value: 9 },
        { name: '通过', value: 10 }
      ],
      footerNavs: [
        { name: '我的串联单', key: 'mine' },
        { name: '串联单库', key: 'list' },
        { name: '审核串联单', key: 'audit' },
        { name: '回收站', key: 'recycle' }
      ],
      pk: 'series.view',
      spreadData: [],
      total: 0
    };
  },
  created() {
    // 子组件向父组件传递值
    this.activeKey = this.$route.query['key'] || this.footerNavs[0].key;
  },
  watch: {
    activeKey() {
      this.pk = this.activeKey == 'audit' ? 'series.audit' : 'series.view';
      this.getStatus(this.listStatus);

      if (['audit', 'list'].includes(this.activeKey)) {
        this.getColumns();
      } else {
        this.col = undefined;
      }
    }
  },
  methods: {
    getColumns() {
      this.$Model.Doc.columns(this.pk).then(data => {
        this.columns = data.filter(item => !item.parent_id);
        if (data.length) {
          this.col = data[0].id;
          this.columnName = data[0].name;
          if (this.activeKey == 'audit') {
            this.getAuditStatus();
          }
        }
      });
    },
    getStatus(listStatus) {
      this.allStatus = listStatus;
      if (this.allStatus.length) {
        this.status = this.allStatus[0].value;
        this.statusName = this.allStatus[0].name;
      }
    },
    async getAuditStatus() {
      let status = await this.$Model.Doc.status(this.col);
      let listStatus = status.map(item => ({ name: item.status_name, value: item.status }));
      this.getStatus(listStatus);
    },
    getTotal(total) {
      this.total = total;
    },
    switchTo(key) {
      this.activeKey = key;
    },
    selectColumn() {
      this.isColSpread = !this.isColSpread;
      this.isStatusSpread = false;
      this.spreadData = this.columns;
    },
    selectStatus() {
      this.isStatusSpread = !this.isStatusSpread;
      this.isColSpread = false;
      this.spreadData = this.allStatus;
    },
    select(item) {
      if (this.isColSpread) {
        this.col = item.id;
        this.columnName = item.name;
        this.isColSpread = !this.isColSpread;
        if (this.activeKey == 'audit') {
          this.getAuditStatus();
        }
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
$default-color: #1890ff;
.page-series {
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
    background: url('./_images/noContent@2x.png');
    margin: 0;
    background-repeat: no-repeat;
    background-size: 210px;
    background-position: center;
  }

  &-main {
    padding-bottom: 55px;
    .s-series-add {
      width: 50px;
      height: 50px;
      position: fixed;
      bottom: 100px;
      right: 40px;
      background-size: contain;
      background-image: url('./_images/add@2x.png');
      background-repeat: no-repeat;
    }
  }
}
.s-footer {
  @each $img in mine, list, audit, recycle {
    span.s-#{$img} {
      background-image: url('./_images/#{$img}@2x.png');
      &.active {
        background-image: url('./_images/#{$img}-active@2x.png');
      }
    }
  }
}
</style>
