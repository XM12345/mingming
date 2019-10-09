<template>
  <div class="h-parse-body">
    <!-- news:attachments -->
    <article
      v-ds-body="[content.content || content.body, content.body_components || content.attachments || content.mobjects, type]"
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
    },
    type: {
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
    img,
    video {
      max-width: 100%;
    }
  }
}
</style>
