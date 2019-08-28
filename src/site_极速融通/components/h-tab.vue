<template>
  <div class="h-tab">
    <div class="h-tab-nav">
      <nav>
        <span
          v-for="item in navItems"
          :key="item.key"
          :class="{active: selectKey == item.key}"
          @click="switchTo(item.key)"
        >
          {{item.name}}
          <!-- <mark></mark> -->
        </span>
      </nav>
    </div>
    <div class="h-tab-item" @scroll="scroll">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    navItems: {
      type: Array,
      default: () => []
    },
    tabKey: {
      type: String,
      default: ''
    },
    listenScroll: {
      default: true
    }
  },
  data() {
    return {
      selectKey: '',
      height: 0,
      i: 0,
      clickI: 0
    };
  },
  created() {
    this.selectKey = this.tabKey;
  },
  methods: {
    switchTo(key) {
      this.selectKey = key;
      let index = this.navItems.findIndex(item => item.key == key);
      this.clickI = index;
      this.$emit('switch', key);
    },
    scroll(event) {
      let { target } = event;
      let { children, scrollTop } = target;
      let length = children.length;
      if (this.clickI > 0) {
        this.i = this.clickI;
      } else if (this.i == 0) {
        this.height = children[0].clientHeight;
        if (scrollTop > this.height) {
          this.i++;
          this.height = this.height + children[this.i].clientHeight;
        }
      } else if (scrollTop > this.height && this.i < length - 1) {
        this.i = this.i + 1;
        this.height = this.height + children[this.i].clientHeight;
      } else if (scrollTop <= children[0].clientHeight) {
        this.i = 0;
      }
      if (this.listenScroll == true) {
        this.selectKey = this.navItems[this.i].key;
      }
      this.clickI = 0; // 清除
    }
  }
};
</script>

<style lang="scss">
.h-tab {
  position: relative;
  height: 100%;
  &-nav {
    position: relative;
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    text-align: center;
    border-bottom: 1px solid #eaeaea;
    background-color: #fff;
    nav {
      display: inline-block;
      span {
        padding: 10px 15px;
        display: inline-block;

        &.active {
          color: #1890ff;
          position: relative;
          &::after {
            content: ' ';
            position: absolute;
            height: 2px;
            width: 15px;
            border-radius: 2px;
            background: #1890ff;
            bottom: 0;
            right: 50%;
            transform: translateX(50%);
          }
        }
      }
    }
  }
  &-item {
    height: calc(100% - 42px);
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
