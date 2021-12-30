<template>
  <div :class="[B()]">
    <div ref="content" :class="[B('__content')]" @scroll="scroll">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'h-page',
  data() {
    return {
      scrollTop: 0
    };
  },
  methods: {
    back() {
      window.history.back();
    },
    scroll(event: Event) {
      this.scrollTop = (this.$refs as any).content.scrollTop;
    }
  },
  activated() {
    (this.$refs as any).content.scrollTop = this.scrollTop;
  }
});
</script>

<style lang="scss">
.h-page {
  position: absolute;
  z-index: 0;
  background: #fff;
  height: 100%;
  width: 100%;
  top: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  &__content {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
