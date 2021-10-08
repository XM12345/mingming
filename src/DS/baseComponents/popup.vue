<template>
  <van-popup
    :class="[B()]"
    v-model="isPopupVisible"
    :position="position"
    :closeable="closeable"
    :round="round"
    :overlay="overlay"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
  >
    <slot></slot>
  </van-popup>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'h-popup',
  props: {
    value: { type: Boolean, default: false },
    /** 弹出位置 */
    position: { type: String, default: 'center' },
    /** 是否显示关闭图标 */
    closeable: { type: Boolean, default: false },
    /** 是否显示圆角 */
    round: { type: Boolean, default: false },
    /** 是否显示遮罩层 */
    overlay: { type: Boolean, default: true },
    /** 自定义遮罩层类名 */
    overlayClass: { type: String, default: '' },
    /** 自定义遮罩层样式 */
    overlayStyle: { type: Object }
  },
  data() {
    return {};
  },
  computed: {
    isPopupVisible: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('input', value);
      }
    }
  },
  methods: {},
  created() {}
});
</script>

<style lang="scss">
.h-popup {
}
</style>
