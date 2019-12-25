<template>
  <div class="page">
    <div class="page-content" @scroll="scroll" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page',
  data() {
    return {
      scrollTop: 0
    };
  },
  methods: {
    back() {
      window.history.back();
    },
    scroll(event) {
      this.scrollTop = this.$refs.content.scrollTop;
    }
  },
  activated() {
    this.$refs.content.scrollTop = this.scrollTop;
  }
};
</script>

<style lang="scss">
.page {
  height: 100%;
  position: relative;
  &-content {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
