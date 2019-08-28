<template>
  <div class="page-doc-history">
    <h-topbar :title="`版本${version.version}`"></h-topbar>
    <article v-html="compare"></article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: {},
      compare: ''
    };
  },
  created() {
    let { params } = this.$route;
    let { doc_id, ver } = params;
    this.$Model.Doc.history(doc_id, ver).then(data => {
      this.version = data;
    });
    this.$Model.Doc.compare(doc_id, ver).then(data => {
      this.compare = data;
    });
  }
};
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
  }
}
</style>
