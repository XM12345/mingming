<template>
  <div :class="[B()]">
    <h-topbar title="公告"></h-topbar>
    <general--list-notice></general--list-notice>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'page-general-notice-index'
});
</script>
