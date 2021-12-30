<template>
  <div :class="[B()]">
    <div :class="[B('__nav')]">
      <nav>
        <span
          v-for="item in columns"
          :key="item.key"
          :class="{ active: selectKey == item.key }"
          @click="switchTo(item.key)"
        >
          {{ item.name }}
        </span>
      </nav>
    </div>
    <div ref="tab" :class="[B('__item')]">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type ITab = {
  name: string;
  key: string | number;
};

export default Vue.extend({
  name: 'h-tab',
  props: {
    columns: { type: Array as () => ITab[], default: () => [] },
    activeIndex: { type: String, default: '' },
    /** 是否监听滚动事件 */
    listenScroll: { default: true }
  },
  data() {
    return {
      selectKey: '' as string | number,
      height: 0,
      i: 0,
      clickI: 0,
      tabElement: undefined as Vue | Element | (Vue | Element)[] | undefined
    };
  },
  created() {
    this.selectKey = this.activeIndex;
    if (this.listenScroll == true) {
      this.$nextTick(() => {
        this.tabElement = this.$refs.tab;
        window.addEventListener('scroll', this.scroll, true);
      });
    }
  },
  methods: {
    switchTo(key: string | number) {
      this.selectKey = key;
      let index = this.columns.findIndex(item => item.key == key);
      this.clickI = index;
      this.$emit('switch', key);
    },
    scroll(event: Event | any) {
      let { target } = event;
      let { scrollTop } = target;
      let children: HTMLCollection = (this.tabElement as any).children;
      let { length } = children;
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
        this.selectKey = this.columns[this.i].key;
      }
      this.clickI = 0;
    }
  }
});
</script>

<style lang="scss">
.h-tab {
  position: relative;
  height: 100%;

  &__nav {
    position: fixed;
    top: 41px;
    z-index: 1000;
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    text-align: center;
    border-top: 10px solid #f4f6f9;
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
  &__item {
    height: calc(100% - 42px);
    padding-top: 52px;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
