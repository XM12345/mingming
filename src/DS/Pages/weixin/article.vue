<template>
  <div :class="[B()]">
    <h-topbar :title="title"></h-topbar>

    <div v-if="article" :class="[B('__main')]">
      <div :class="[B('__intro')]">
        <div :class="[B('__intro_message')]">
          <p :class="[B('__intro_title')]">{{ article.title }}</p>
          <div :class="[B('__intro_user')]">
            <span>作者: {{ article.author }}</span>
          </div>
        </div>
      </div>
      <base--parse-body :content="article"></base--parse-body>
    </div>

    <h-navigation :navigation="navigation" :height="70" :iconSize="35" @switch="switchTo"></h-navigation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weixin-article-content',
  data() {
    return {
      article: null as any,
      accountId: 0,
      contentId: 0,
      navigation: [{ text: '批注', type: 'comment', icon: require('../doc/_images/comment@2x.png') }]
    };
  },
  computed: {
    title(): string {
      return this.article?.title || '';
    }
  },
  created() {
    let { account_id, content_id, article_id } = this.$route.params;
    this.accountId = Number(account_id) || 0;
    this.contentId = Number(content_id) || 0;
    this.$Model.Weixin.content(account_id, content_id).then(data => {
      this.article = data.articles.find((item: any) => item.id === Number(article_id));
    });
  },
  methods: {
    switchTo(type: string) {
      this.$router.push(`/weixin/${this.accountId}/content/${this.contentId}`);
    }
  }
});
</script>

<style lang="scss">
.page-weixin-article-content {
  background: #f4f6f9;

  &__main {
    padding-bottom: 70px;
  }

  &__intro {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #fff;

    &_message {
      flex-grow: 1;
    }
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
    &_user {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
