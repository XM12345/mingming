<template>
  <header v-show="content.summary" :class="[B()]">
    <p>{{ content.summary }}</p>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'cms--summary',
  props: {
    content: { type: Object, default: () => ({}) }
  }
});
</script>

<style lang="scss">
.cms--summary {
  background: #f1f1f1;
  font-size: 15px;
  color: #363636;
  padding: 8px 15px;
  text-align: justify;
  p {
    margin: 0;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;

    &::before {
      content: '导读';
      font-weight: bold;
      padding-right: 5px;
    }
  }
}
</style>
