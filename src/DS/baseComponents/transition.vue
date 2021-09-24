<template>
  <transition :name="B('__' + name)">
    <slot></slot>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'h-transition',
  props: {
    name: { type: String as PropType<'default'>, default: 'default' }
  }
});
</script>

<style lang="scss">
.h-transition {
  &__default {
    &-enter-active,
    &-leave-active {
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    &-enter,
    &-leave-to {
      opacity: 0;
      transform: scale(0.1);
    }
  }
}
</style>
