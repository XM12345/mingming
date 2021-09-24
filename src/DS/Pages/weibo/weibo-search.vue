<template>
  <div class="page-search">
    <base--topbar>
      <div>
        <input
          type="text"
          placeholder="请输入关键词"
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
      <weibo--list-article :searchkey="name" v-if="name"></weibo--list-article>
    </div>
  </div>
</template>
<script>
export default {
  extends: require('../doc/search').default
};
</script>
