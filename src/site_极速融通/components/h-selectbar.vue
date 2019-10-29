<template>
  <div class="h-selectbar">
    <header class="s-header">
      <div class="s-columns" @click="openColumns">
        <span :class="{active: isColSpread}">{{columnName}}</span>
        <mark :class="{active: isColSpread}"></mark>
      </div>
      <div class="s-status" @click="openStatus">
        <span :class="{active: isStatusSpread}">{{statusName}}</span>
        <mark :class="{active: isStatusSpread}"></mark>
      </div>
      <ul class="header-dropdown" v-if="isColSpread || isStatusSpread">
        <li
          :class="[(isColSpread && item.id == col) || (isStatusSpread && item.value == status) ? 'active' : '']"
          v-for="item in spreadData"
          :key="item.value"
          @click="select(item)"
        >
          {{item.name}}
          <span
            v-if="(isColSpread && item.id == col) || (isStatusSpread && item.value == status)"
          >√</span>
        </li>
        <slot></slot>
      </ul>
    </header>
    <div class="header-modal" v-if="isColSpread || isStatusSpread" @click="close"></div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      required: true,
      default: () => []
    },
    allStatus: {
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      col: '',
      columnName: '',
      status: -1,
      statusName: '',
      isColSpread: false,
      isStatusSpread: false,
      spreadData: []
    };
  },
  created() {
    let { columns, allStatus } = this;
    if (columns.length) {
      this.col = columns[0].id;
      this.columnName = columns[0].name;
    }
    this.status = this.allStatus[0].value;
    this.statusName = this.allStatus[0].name;
  },
  methods: {
    openColumns() {
      this.isColSpread = !this.isColSpread;
      this.isStatusSpread = false;
      this.spreadData = this.columns;
    },
    openStatus() {
      this.isStatusSpread = !this.isStatusSpread;
      this.isColSpread = false;
      this.spreadData = this.allStatus;
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
      this.$emit('select', item);
    },
    close() {
      this.isColSpread = false;
      this.isStatusSpread = false;
    }
  }
};
</script>

<style lang="scss">
.h-selectbar {
  .s-header {
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
      span {
        margin-left: 10px;
      }
      &.active {
        color: #1890ff;
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