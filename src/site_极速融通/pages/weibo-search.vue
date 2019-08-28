<template>
  <div class="page-search">
    <h-topbar>
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
    </h-topbar>
    <div class="s-main">
      <p class="s-main-message" v-if="message">{{message}}</p>
      <p class="s-main-nodata" v-if="name && !searchList.length"></p>
      <weibo--list-article
        :searchkey="name"
        :isLoad="isLoad"
        @data="list"
      ></weibo--list-article>
    </div>
  </div>
</template>
<script>
export default {
  extends: require('./search').default
};
</script>
