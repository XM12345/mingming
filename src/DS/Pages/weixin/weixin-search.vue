<template>
  <div class="page-search">
    <base--topbar>
      <div>
        <input
          type="text"
          :placeholder="`在${columnName}下搜索关键词`"
          v-model.trim="keyword"
          @input="lazySearch"
          @keyup.enter="search"
          ref="input"
        />
        <mark @click="clear" v-if="keyword != ''">✕</mark>
      </div>
    </base--topbar>
    <div class="s-main">
      <p class="s-main-message" v-if="message">{{ message }}</p>
      <weixin--list-tuwen :accountId="col" :keyword="name" v-if="name"></weixin--list-tuwen>
    </div>
  </div>
</template>
<script>
export default {
  extends: require('../doc/search').default,
  data() {
    return {
      col: '',
      columnName: null
    };
  },
  created() {
    let { params } = this.$route;
    let { col, columnName } = params;
    this.col = col;
    this.columnName = columnName;
  }
};
</script>
