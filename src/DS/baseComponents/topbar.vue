<template>
  <div :class="[B()]">
    <header :class="[B('__header')]">
      <label :class="[B('__back')]" @click="back"></label>
      <span v-if="title" :class="[B('__title')]">{{ title }}</span>
      <slot></slot>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'h-topbar',
  props: {
    title: { type: String, default: '' }
  },
  methods: {
    back() {
      this.$back();
    }
  }
});
</script>

<style lang="scss">
.h-topbar {
  height: 41px;
  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    z-index: 999;
    height: 41px;
    box-sizing: border-box;
  }

  &__back {
    position: absolute;
    height: 40px;
    width: 40px;
    background-image: url('./images/icon-back.png');
    background-repeat: no-repeat;
    background-size: 18px;
    background-position: center center;
  }
  &__title {
    height: 40px;
    line-height: 40px;
    padding: 0 40px;
    display: block;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &-search {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background-color: transparent;
    background-image: url('./images/icon-search.png');
    background-repeat: no-repeat;
    background-size: 18px;
    background-position: center center;
    border: none;
  }
}
</style>
