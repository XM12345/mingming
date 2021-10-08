<template>
  <h-popup :class="[B()]" position="bottom" v-model="isPopupVisible">
    <van-datetime-picker
      type="datetime"
      :formatter="formatter"
      @confirm="onConfirm"
      @cancel="onCancel"
      v-model="currentDate"
    />
  </h-popup>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'doc--popup-datetime-picker',
  props: { value: { type: Boolean, default: false } },
  data() {
    return {
      minDate: new Date(),
      currentDate: new Date(),
      formatter(type: string, value: number) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        if (type === 'day') {
          return `${value}日`;
        }
        if (type === 'hour') {
          return `${value}时`;
        }
        if (type === 'minute') {
          return `${value}分`;
        }
        return value;
      }
    };
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
  methods: {
    onConfirm(date: Date) {
      let timeStamp = new Date(date).getTime() / 1000;
      this.$emit('confirm', timeStamp);
      this.isPopupVisible = false;
    },
    onCancel() {
      this.isPopupVisible = false;
    }
  }
});
</script>

<style></style>
