<template>
  <header class="cms--summary" v-if="content.summary">
    <p>{{ content.summary }}</p>
  </header>
</template>

<script>
export default {
  props: {
    content: {
      default: () => ({})
    }
  }
};
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
