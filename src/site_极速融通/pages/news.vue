<template>
  <div class="page-news-content page-detail">
    <h-topbar></h-topbar>
    <div class="s-main page-detail-main" :style="{'bottom':operate_able.length ? '70px' : '0'}">
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
      <h-parse-body :content="content"></h-parse-body>
    </div>
    <!-- <footer class="s-footer" v-if="operate_able.length">
      <span
        :class="`s-${item.key}`"
        v-for="item in operate_able"
        :key="item.key"
        @click="handle(item.key)"
      >{{item.name}}</span>
    </footer> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      news_id: undefined,
      content: '',
      operate_able: []
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
      });
    },
    handle(key) {
      if (key == 'subject') {
        this.topic();
      } else if (key == 'clue') {
        this.copy();
      }
    },
    topic() {
      this.$Model.News.topic(this.news_id).then(data => {
        this.$toast('生成选题成功');
      });
    },
    copy() {
      this.$Model.News.copy(this.news_id).then(data => {
        this.$toast('生成通稿成功');
      });
    }
  }
};
</script>

<style lang="scss">
.page-news-content {
  article {
    overflow-x: hidden;
  }
  .s-footer {
    @each $img in subject, clue {
      span.s-#{$img} {
        background-image: url('../images/detail/#{$img}@2x.png');
      }
    }
  }
}
</style>