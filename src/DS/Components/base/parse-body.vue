<template>
  <div class="h-parse-body">
    <article
      v-ds-body="[
        content.content || content.body,
        content.body_components || content.bodyComponents || content.attachments
      ]"
      ref="bodyContent"
    ></article>
  </div>
</template>

<script>
import dsBodyDirective from './bodyDirective';
export default {
  props: {
    content: {
      default: ''
    }
  },
  directives: {
    'ds-body': dsBodyDirective
  }
};
</script>

<style lang="scss">
.h-parse-body {
  background: #fff;
  overflow: hidden;
  article {
    padding: 10px 15px 70px;
    word-break: break-word;
    overflow: hidden;

    p {
      overflow: hidden;
    }
    img,
    video,
    p,
    section,
    div,
    table.ul,
    span,
    article,
    h1,
    h1,
    h3,
    h4,
    h5 {
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
      tbody,
      thead,
      tr,
      td,
      section,
      div,
      p,
      article,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        width: auto !important;
        max-width: 100% !important;
      }
    }
  }
}
</style>
