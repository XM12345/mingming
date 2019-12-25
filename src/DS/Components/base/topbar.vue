<template>
  <div class="h-topbar">
    <header>
      <label @click="back"></label>
      <span v-if="title">{{title}}</span>
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
    height: 40px;
    label {
      position: absolute;
      height: 40px;
      width: 40px;
      background-image: url('./_images/back@2x.png');
      background-repeat: no-repeat;
      background-size: 18px;
      background-position: center center;
      /* &::before,
      &::after {
        position: absolute;
        top: 19px;
        left: 13px;
        content: '';
        width: 13px;
        height: 2px;
        color: #333;
        background-color: #333;
        transform-origin: left center;
      }
      &::before {
        transform: rotate(40deg);
      }
      &::after {
        transform: rotate(-40deg);
      } */
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

    a {
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 40px;
      background-image: url('./_images/search@2x.png');
      background-repeat: no-repeat;
      background-size: 18px;
      background-position: center center;

      /* &::before {
        content: '';
        width: 16px;
        height: 16px;
        position: absolute;
        top: 11px;
        left: 11px;
        border: 2px solid #555;
        border-radius: 50%;
        box-sizing: border-box;
      }
      &::after {
        content: '';
        width: 6px;
        height: 3px;
        position: absolute;
        top: 24px;
        left: 24px;
        background-color: #555;
        transform: rotate(45deg);
      } */
    }
  }
}
</style>

