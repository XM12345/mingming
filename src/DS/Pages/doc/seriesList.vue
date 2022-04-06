<template>
  <div class="page-series">
    <h-topbar title="串联单">
      <h-link class="h-topbar-search" to="/docs/series/search"></h-link>
    </h-topbar>

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
      <doc--list-series
        v-if="['list', 'audit'].includes(activeKey) ? col : 'true'"
        :col="col"
        :status="status"
        :activeKey="activeKey"
        @total="getTotal"
      ></doc--list-series>
      <h-link class="s-series-add" to="/docs/series/add"></h-link>
    </div>

    <h-navigation :activeType="activeKey" :navigation="navigation" @switch="switchTo"></h-navigation>
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
      navigation: [
        {
          text: '我的串联单',
          type: 'mine',
          icon: require('./_images/mine@2x.png'),
          iconActive: require('./_images/mine-active@2x.png')
        },
        {
          text: '串联单库',
          type: 'list',
          icon: require('./_images/list@2x.png'),
          iconActive: require('./_images/list-active@2x.png')
        },
        {
          text: '审核串联单',
          type: 'audit',
          icon: require('./_images/audit@2x.png'),
          iconActive: require('./_images/audit-active@2x.png')
        },
        {
          text: '回收站',
          type: 'recycle',
          icon: require('./_images/recycle@2x.png'),
          iconActive: require('./_images/recycle-active@2x.png')
        }
      ],
      pk: 'series.view',
      spreadData: [],
      total: 0
    };
  },
  created() {
    // 子组件向父组件传递值
    this.activeKey = this.$route.query['key'] || this.navigation[0].key;
  },
  watch: {
    activeKey() {
      this.pk = this.activeKey == 'audit' ? 'series.audit' : 'series.view';
      this.getStatus(this.listStatus);

      if (['audit', 'list'].includes(this.activeKey)) {
        this.col = undefined;
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
      this.$setQuery({ key });
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
