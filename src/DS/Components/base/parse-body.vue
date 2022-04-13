<template>
  <div :class="[B()]">
    <article
      v-ds-body="[
        content.content || content.body,
        content.body_components || content.bodyComponents || content.attachments
      ]"
      ref="bodyContent"
      :class="[B('__article')]"
    ></article>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dsBodyDirective from './bodyDirective';

export default Vue.extend({
  name: 'h-parse-body',
  props: {
    content: { type: Object, default: () => ({}) }
  },
  directives: { 'ds-body': dsBodyDirective }
});
</script>

<style lang="scss">
.h-parse-body {
  background: #fff;
  &__article {
    padding: 10px 15px 70px;
    word-break: break-all;
    overflow-x: auto;
    * {
      max-width: 100% !important;
    }
    table {
      width: auto !important;
      height: auto !important;
      max-width: 100% !important;
      //border: 1px solid #ccc;
      border-collapse: collapse;
      word-break: normal;
      text-align: center;
      font-size: 14px;
      td {
        width: auto !important;
        //border: 1px solid #ccc;
        padding: 12px 10px;
      }
      * {
        width: auto !important;
        max-width: 100% !important;
      }
    }
  }
}
</style>
