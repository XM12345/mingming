<template>
  <div :class="[B()]">
    <h-topbar></h-topbar>
    <div :class="[B('__main')]">
      <div :class="[B('__intro')]">
        <div :class="[B('__intro_message')]">
          <p :class="[B('__intro_title')]">{{ content.title }}</p>
          <div :class="[B('__intro_author')]">
            <time>{{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
            <span>来源：{{ content.source_name }}</span>
            <span>作者：{{ content.author }}</span>
          </div>
          <div :class="[B('__intro_link')]" v-if="content.refer_url">
            原文链接:
            <a :href="content.refer_url">{{ content.refer_url }}</a>
          </div>
        </div>
      </div>

      <base--parse-body :class="[B('__body')]" :content="content"></base--parse-body>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-news-content',
  data() {
    return {
      newsId: 0,
      content: {} as any
    };
  },
  created() {
    let { news_id } = this.$route.params;
    this.newsId = Number(news_id) || 0;
    this.init();
  },
  methods: {
    async init() {
      let content = await this.$Model.News.news(this.newsId);
      if (content) {
        this.content = content;
        this.$title(content.title);
      }
    }
  }
});
</script>

<style lang="scss">
.page-news-content {
  background: #f4f6f9;

  &__intro {
    padding: 10px 15px;
    background: #fff;

    &_title {
      margin: 0;
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    &_author {
      font-size: 12px;
      color: #999;
      & > * {
        padding: 0 10px 0 0;
      }
    }

    &_link {
      font-size: 12px;
      color: #999;
      a {
        color: #999;
        word-break: break-all;
      }
    }
  }
}
</style>
