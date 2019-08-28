<template>
  <div class="h-parse-body">
    <article
      v-ds-body="[content.content || content.body, content.attachments || content.mobjects, type]"
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
  padding: 10px 15px 30px;
  article {
    word-break: break-word;
    img,
    video {
      max-width: 100%;
    }
  }
}
</style>
