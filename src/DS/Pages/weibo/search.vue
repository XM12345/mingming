<template>
  <div :class="[B()]">
    <h-topbar>
      <div :class="[B('__input')]">
        <input
          ref="input"
          v-model.trim="keyword"
          type="text"
          placeholder="请输入关键词"
          @input="lazySearch"
          @keyup.enter="search"
        />
        <mark @click="clear" v-if="keyword != ''">✕</mark>
      </div>
    </h-topbar>

    <div :class="[B('__main')]">
      <p v-if="message" :class="[B('__message')]">{{ message }}</p>
      <weibo--list-article v-if="name" :searchkey="name"></weibo--list-article>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weibo-search',
  data() {
    return {
      keyword: '',
      intervalId: 0,
      message: '',
      name: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      (this.$refs['input'] as any)?.focus();
    });
  },
  methods: {
    lazySearch() {
      clearTimeout(this.intervalId);
      this.intervalId = setTimeout(() => {
        this.search();
      }, 500);
    },
    search() {
      if (this.keyword) {
        this.message = '正在搜索...';
        setTimeout(() => {
          this.message = '';
        }, 1000);
        this.name = this.keyword;
      }
    },
    clear() {
      this.keyword = '';
    }
  }
});
</script>
<style lang="scss">
.page-weibo-search {
  position: relative;
  min-height: 100%;
  background-color: #f4f6f9;

  &__input {
    position: relative;
    margin: 0 40px;
    input {
      height: 38px;
      width: 100%;
      padding: 0;
      font-size: 15px;
      background: transparent;

      border: none;
      outline: none;
      &::placeholder {
        color: #999;
      }
    }
    mark {
      position: absolute;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #fff;
      color: #999;
    }
  }

  &__message {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin: 5px 0;
  }
}
</style>
