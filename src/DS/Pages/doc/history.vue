<template>
  <div :class="[B()]">
    <h-topbar :title="`版本${version.version}`"></h-topbar>
    <article v-html="compare"></article>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-doc-history',
  data() {
    return {
      version: {} as any,
      compare: ''
    };
  },
  created() {
    let { doc_id, ver } = this.$route.params;
    this.$Model.Doc.history(doc_id, ver).then(data => {
      this.version = data;
    });
    this.$Model.Doc.compare(doc_id, ver).then(data => {
      this.compare = data;
    });
  }
});
</script>

<style lang="scss">
.page-doc-history {
  article {
    padding: 15px;
    word-break: break-word;
    .diffinsert {
      color: #690;
    }
    .diffdelete {
      color: red;
      text-decoration: line-through;
      font-style: oblique;
    }
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
  }
}
</style>
