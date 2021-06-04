<template>
  <router-link class="base--link" :to="to">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'base-link',
  props: {
    to: {
      type: String,
      default: ''
    }
  }
});
</script>
