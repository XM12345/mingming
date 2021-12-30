<template>
  <div class="page-weixin-article page-detail">
    <h-topbar :title="article.title"></h-topbar>
    <div class="page-weixin-article-main page-detail-main">
      <div class="s-intro">
        <div class="s-intro-mes">
          <p>{{ article.title }}</p>
          <footer>
            <span>作者: {{ article.author }}</span>
          </footer>
        </div>
      </div>
      <base--parse-body :content="article"></base--parse-body>
    </div>
    <footer class="s-footer">
      <h-link class="s-comment" :to="`/weixin/${account_id}/content/${content_id}`">
        <span>批注</span>
      </h-link>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      account_id: undefined,
      content_id: undefined
    };
  },
  created() {
    let { params } = this.$route;
    let { account_id, content_id, article_id } = params;
    this.account_id = account_id;
    this.content_id = content_id;
    this.$Model.Weixin.content(account_id, content_id).then(data => {
      let { articles } = data;
      this.article = articles.find(item => item.id == article_id);
    });
  }
};
</script>

<style lang="scss">
.page-weixin-article {
  .s-footer {
    a {
      flex-grow: 1;
      font-size: 12px;
      background-repeat: no-repeat;
      background-size: 35px;
      background-position: center top;
      padding-top: 38px;
    }
    @each $img in comment {
      a.s-#{$img} {
        background-image: url('../doc/_images/#{$img}@2x.png');
      }
    }
  }
}
</style>
