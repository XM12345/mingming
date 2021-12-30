<template>
  <router-link :class="[B()]" :to="to">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'h-link',
  props: {
    to: { type: String, default: '' }
  }
});
</script>
