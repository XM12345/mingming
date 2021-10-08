<template>
  <h-popup :class="[B()]" position="bottom" v-model="isPopupVisible">
    <van-picker :columns="columns" :show-toolbar="true" @confirm="onConfirm" @cancel="onCancel"></van-picker>
  </h-popup>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'doc--popup-picker',
  props: {
    value: { type: Boolean, default: false },
    columns: { type: Array, default: () => [] }
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
    onConfirm(values: string[]) {
      this.$emit('confirm', values);
      this.isPopupVisible = false;
    },
    onCancel() {
      this.isPopupVisible = false;
    }
  }
});
</script>

<style></style>
