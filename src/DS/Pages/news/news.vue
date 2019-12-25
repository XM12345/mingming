<template>
  <div class="page-news-content page-detail">
    <base--topbar></base--topbar>
    <div class="s-main page-detail-main">
      <div class="s-intro">
        <div class="s-intro-mes">
          <p>{{content.title}}</p>
          <footer>
            <span>{{content.author}}</span>
            <time>{{content.creation_time | ds_time('yyyy-MM-dd hh:mm')}}</time>
            <span>{{content.keywords}}</span>
          </footer>
          <div class="s-intro-mes-link" v-if="content.refer_url">
            原文链接:
            <a :href="content.refer_url">{{content.refer_url}}</a>
          </div>
        </div>
      </div>
      <base--parse-body :content="content"></base--parse-body>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      news_id: undefined,
      content: ''
    };
  },
  created() {
    let { params } = this.$route;
    let { news_id } = params;
    this.news_id = news_id;
    this.init();
  },
  methods: {
    init() {
      this.$Model.News.news(this.news_id).then(data => {
        this.content = data;
        this.$title(data.title);
      });
    }
  }
};
</script>

<style lang="scss">
.page-news-content {
  .s-main {
    border-bottom: 10px solid #f4f6f9;
    .s-intro-mes-link {
      font-size: 12px;
      color: #999;
      a {
        color: #999;
        word-break: break-all;
      }
    }
    article {
      overflow-x: hidden;
    }
  }
}
</style>