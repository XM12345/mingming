<template>
  <div :class="[B()]" :style="{ height: height + 'px' }">
    <div
      v-for="item in navigation"
      :key="item.type"
      :class="[B('__item'), isActive(item.type) && 'active']"
      @click="switchTo(item.type)"
    >
      <img :style="imgStyle" :src="isActive(item.type) ? item.iconActive : item.icon" alt="" />
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'h-navigation',
  props: {
    activeType: { type: String, default: '' },
    navigation: {
      type: Array as PropType<{ text: string; type: string; icon: string; iconActive: string }[]>,
      required: true
    },
    height: { type: Number, default: 55 },
    iconSize: { type: Number, default: 24 }
  },
  data() {
    return {};
  },
  computed: {
    imgStyle(): { height: string; width: string } {
      return {
        height: this.iconSize + 'px',
        width: this.iconSize + 'px'
      };
    }
  },
  created() {},
  methods: {
    isActive(type: string) {
      return this.activeType == type;
    },
    switchTo(type: string) {
      this.$emit('switch', type);
    }
  }
});
</script>

<style lang="scss">
.h-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  text-align: center;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px -1px 8px rgba(0, 0, 0, 0.08);
  &__item {
    flex: 1;
    &.active {
      span {
        color: #1890ff;
      }
    }
    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    span {
      display: block;
      font-size: 10px;
      color: #afafaf;
      white-space: nowrap;
    }
  }
}
</style>
