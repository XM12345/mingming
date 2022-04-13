<template>
  <div :class="[B()]">
    <h-topbar></h-topbar>

    <div v-if="content" :class="[B('__main')]">
      <cms--video
        v-if="content.type === 'video'"
        :baview_api_url="baview_api_url"
        :extension="content.fields"
      ></cms--video>

      <div :class="[B('__title')]">
        <h1>{{ content.title }}</h1>
        <div :class="[B('__title_message')]">
          <header v-if="content.author_id">
            <h-user :src="content.author_avatar_url"></h-user>
            <span>{{ content.author_nickname || content.author_name }}</span>
            <time>{{ $F.time(content.publish_time, 'yyyy-MM-dd hh:mm') }}</time>
          </header>
        </div>
      </div>

      <cms--summary v-if="content.summary" :content="content"></cms--summary>

      <base--parse-body :content="content"></base--parse-body>

      <cms--pictureset
        v-if="content.type === 'pictureset'"
        :baview_api_url="baviewApiUrl"
        :extension="content.fields"
      ></cms--pictureset>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-cms-content',
  data() {
    return {
      baviewApiUrl: '',
      contentId: 0,
      content: null as any
    };
  },
  async created() {
    this.contentId = Number(this.$route.params.content_id) || 0;
    this.getBaview();
  },
  methods: {
    async getBaview() {
      let config = await this.$Model.General.config();
      let { baview_api_url } = config;
      this.baviewApiUrl = baview_api_url;
      this.getContent().then(data => {
        this.content = data;
      });
    },
    getContent() {
      return this.$Model.Cms(this.baviewApiUrl).content(this.contentId);
    }
  }
});
</script>

<style lang="scss">
.page-cms-content {
  &__title {
    padding: 20px 15px;
    h1 {
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }
    &_message {
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
