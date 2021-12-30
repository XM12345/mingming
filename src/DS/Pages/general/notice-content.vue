<template>
  <div :class="[B()]">
    <h-topbar title="公告"></h-topbar>
    <div :class="[B('__main')]">
      <header :class="[B('__header')]">
        <h3>{{ content.title }}</h3>
        <p>
          <span>{{ content.author_nickname || content.author_name }}</span>
          <time>{{ $F.time(parseInt(content.creation_time), 'yyyy-MM-dd hh:mm') }}</time>
        </p>
      </header>
      <base--parse-body :content="content"></base--parse-body>
      <div v-if="content.attachments && content.attachments.length" :class="[B('__attachments')]">
        <h3>附件</h3>
        <a
          :href="`${item.url}?d=${item.title}`"
          :download="item.title"
          v-for="item in content.attachments"
          :key="item.id"
        >
          <p>{{ item.title }}</p>
          <span>{{ $F.size(item.size) }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-general-notice-content',
  data() {
    return {
      content: {} as any,
      noticeId: 0
    };
  },
  created() {
    let { notice_id } = this.$route.params;
    this.noticeId = Number(notice_id) || 0;
    this.init();
  },
  methods: {
    async init() {
      let content = await this.$Model.General.notice(this.noticeId);
      if (content) {
        this.content = content;
        this.$title(content.title);

        if (!content.has_read) {
          await this.$Model.General.read(this.noticeId);
        }
      }
    }
  }
});
</script>

<style lang="scss">
.page-general-notice-content {
  &__main {
    padding: 10px;
    border-top: 10px solid #f4f6f9;
  }

  &__header {
    text-align: center;
    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      font-weight: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
    }
    p {
      margin: 10px 0;
      font-size: 15px;
      color: #999;

      span {
        padding-right: 15px;
      }
    }
  }

  .h-parse-body {
    article {
      color: #333;
      font-size: 15px;
      padding-bottom: 30px;
    }
  }

  &__attachments {
    h3 {
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      color: #333;
    }
    a {
      display: block;
      font-size: 12px;
      padding: 10px 0;
      p {
        margin: 0;
        margin-bottom: 5px;
        color: #333;
      }
      span {
        color: #999;
      }
    }
  }
}
</style>
