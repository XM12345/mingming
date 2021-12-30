<template>
  <div class="page-cms-content">
    <h-topbar></h-topbar>
    <!-- 视频 -->
    <cms--video
      :baview_api_url="baview_api_url"
      :extension="content.fields"
      v-if="content.type == 'video'"
    ></cms--video>
    <!-- 标题 -->
    <div class="s-title">
      <h1>{{ content.title }}</h1>
      <div class="page-cms--content-header">
        <header v-if="content.author_id">
          <h-user :src="content.author_avatar_url"></h-user>
          <span>{{ content.author_nickname || content.author_name }}</span>
          <time>{{ $F.time(content.publish_time, 'yyyy-MM-dd hh:mm') }}</time>
        </header>
      </div>
    </div>
    <!-- 导读 -->
    <cms--summary :content="content" v-if="content.summary"></cms--summary>
    <!-- 富文本 -->
    <base--parse-body :content="content"></base--parse-body>
    <!-- 图集 -->
    <cms--pictureset
      :baview_api_url="baview_api_url"
      :extension="content.fields"
      v-if="content.type == 'pictureset'"
    ></cms--pictureset>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baview_api_url: undefined,
      content_id: undefined,
      content: {}
    };
  },
  async created() {
    let { params } = this.$route;
    this.content_id = params.content_id;
    this.getBaview();
  },
  methods: {
    async getBaview() {
      let config = await this.$Model.General.config();
      let { baview_api_url } = config;
      this.baview_api_url = baview_api_url;
      this.getContent().then(data => {
        this.content = data;
      });
    },
    getContent() {
      return this.$Model.Cms(this.baview_api_url).content(this.content_id);
    }
  }
};
</script>

<style lang="scss">
.page-cms-content {
  .s-title {
    padding: 20px 15px;
    h1 {
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }
    .page-cms--content-header {
      header {
        position: relative;
        img {
          float: left;
          width: 33px;
          height: 33px;
          margin-right: 10px;
          border-radius: 50%;
        }
        span {
          line-height: 1;
          font-size: 15px;
          color: #212121;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        time {
          font-size: 12px;
          color: #adadad;
        }
      }
    }
  }
}
</style>
