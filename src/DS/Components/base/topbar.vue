<template>
  <div class="h-topbar">
    <header>
      <label @click="back"></label>
      <span v-if="title">{{ title }}</span>
      <slot></slot>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  },
  methods: {
    back() {
      // app内部回调原生返回
      this.$back();
    }
  }
};
</script>

<style lang="scss">
.h-topbar {
  height: 41px;
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    z-index: 999;
    height: 41px;
    box-sizing: border-box;
    label {
      position: absolute;
      height: 40px;
      width: 40px;
      background-image: url('./_images/back@2x.png');
      background-repeat: no-repeat;
      background-size: 18px;
      background-position: center center;
    }
    span {
      height: 40px;
      line-height: 40px;
      padding: 0 40px;
      display: block;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &-search {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background-color: transparent;
    background-image: url('./_images/search@2x.png');
    background-repeat: no-repeat;
    background-size: 18px;
    background-position: center center;
    border: none;
  }
}
</style>
