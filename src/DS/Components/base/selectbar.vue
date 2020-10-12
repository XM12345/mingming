<template>
  <div class="h-selectbar">
    <header class="s-header">
      <div class="s-header-bars">
        <div
          :class="['s-header-bar', { active: isSpread(bar) }]"
          v-for="(bar, index) in selectBar"
          :key="index"
          @click="select(bar, index)"
        >
          <span>{{ bar.valueName }}</span>
          <mark></mark>
        </div>
      </div>
      <ul class="header-dropdown" v-if="isSelect">
        <doc--list-columns
          :tree="list"
          @select="choose"
          v-if="selectBar[selectIndex] && selectBar[selectIndex].type == 'column'"
        ></doc--list-columns>
        <template v-else>
          <li
            :class="{
              active: isActive(item)
            }"
            v-for="item in list"
            :key="item.value"
            @click="choose(item)"
          >
            {{ item.name }}
            <span v-if="isActive(item)">√</span>
          </li>
        </template>
        <slot></slot>
      </ul>
    </header>
    <div class="header-modal" v-if="isSelect" @click="close"></div>
  </div>
</template>

<script>
export default {
  props: {
    selectBar: {
      default: () => []
    }
  },
  data() {
    return {
      isSelect: false,
      selectIndex: 0,
      list: []
    };
  },
  methods: {
    select(item, index) {
      let { returnWord, list } = item;
      let curentItem = this.selectBar[this.selectIndex] || {};
      if (curentItem.returnWord && curentItem.returnWord != returnWord) {
        this.isSelect = true;
      } else {
        this.isSelect = !this.isSelect;
      }
      this.selectIndex = index;
      this.list = list;
    },
    close() {
      this.isSelect = false;
    },
    isSpread(bar) {
      let currentItem = this.selectBar[this.selectIndex] || {};
      return bar.returnWord == currentItem.returnWord && this.isSelect;
    },
    isActive(item) {
      let currentItem = this.selectBar[this.selectIndex] || {};
      return (
        (item.id != undefined && item.id == currentItem.value) ||
        (item.value != undefined && item.value == currentItem.value)
      );
    },
    choose(item) {
      item.type = this.selectBar[this.selectIndex].returnWord;
      this.selectBar[this.selectIndex].value = item.id || item.value;
      this.selectBar[this.selectIndex].valueName = item.name;
      this.isSelect = !this.isSelect;
      this.$emit('select', item);
    }
  }
};
</script>

<style lang="scss">
.h-selectbar {
  .s-header {
    position: relative;
    &-bars {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      overflow-x: auto;
      & > div {
        display: inline-block;
        white-space: nowrap;
        span {
          color: #666;
          font-size: 15px;
        }
        mark {
          display: inline-block;
          margin-left: 5px;
          border: 5px solid;
          background: none;
          border-color: #666 transparent transparent;
          transition: all 0.5s;
        }
        &.active {
          span {
            color: #1890ff;
          }
          mark {
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
    background: #fff;
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
    position: fixed;
    width: 100%;
    top: 100px;
    bottom: 0;
    z-index: 500;
    background: #333;
    opacity: 0.7;
  }
}
</style>
