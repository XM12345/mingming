<template>
  <div class="page-news-content page-detail">
    <h-topbar></h-topbar>
    <div class="s-main page-detail-main">
      <div class="s-intro">
        <div class="s-intro-mes">
          <p>{{content.title}}</p>
          <footer>
            <span>{{content.author}}</span>
            <time>{{content.creation_time | ds_time('yyyy-MM-dd hh:mm')}}</time>
            <span>{{content.keywords}}</span>
          </footer>
        </div>
      </div>
      <h-parse-body :content="content" type="news"></h-parse-body>
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
    article {
      overflow-x: hidden;
    }
  }
}
</style>