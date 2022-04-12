<template>
  <div :class="[B()]">
    <h-topbar title="公告"></h-topbar>

    <div v-if="content" :class="[B('__main')]" :style="mainStyle">
      <h1 :class="[B('__title')]">{{ content.title }}</h1>

      <div :class="[B('__description')]">
        <span>{{ content.author_nickname || content.author_name }}</span>
        <time>{{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
        <span :class="[B('__description_status'), `--${statusClassName}`]">{{ statusName }}</span>
      </div>

      <base--parse-body :content="content"></base--parse-body>

      <div v-if="content.attachments && content.attachments.length" :class="[B('__attachments')]">
        <h3>附件</h3>
        <a
          v-for="item in content.attachments"
          :key="item.id"
          :href="`${item.url}?d=${item.title}`"
          :download="item.title"
        >
          <p>{{ item.title }}</p>
          <span>{{ $F.size(item.size) }}</span>
        </a>
      </div>
    </div>

    <h-navigation
      v-if="navigation.length"
      :navigation="navigation"
      :height="70"
      :iconSize="35"
      @switch="switchTo"
    ></h-navigation>

    <!-- 审核 -->
    <base--popup-audit v-model="isAuditVisible" @audit="audit"></base--popup-audit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
enum ENoticeOperation {
  编辑 = 1,
  提交 = 2,
  审核 = 3,
  上线 = 4,
  下线 = 5,
  删除 = 6
}
export default Vue.extend({
  name: 'page-general-notice-manage-content',
  data() {
    return {
      noticeId: 0,
      content: null as any,
      isAuditVisible: false,
      navigation: [] as { text: string; type: string; icon: string }[]
    };
  },
  computed: {
    statusName(): string {
      return ['草稿', '上线', '下线', '待审', '审核通过', '审核退回'][(this.content?.status || 1) - 1];
    },
    statusClassName(): string {
      return ['draft', 'online', 'offline', 'pending', 'pass', 'fail'][(this.content?.status || 1) - 1];
    },
    mainStyle(): { 'padding-bottom': string } | undefined {
      return this.navigation.length ? { 'padding-bottom': '70px' } : undefined;
    }
  },
  created() {
    let { notice_id } = this.$route.params;
    this.noticeId = Number(notice_id) || 0;
    this.init();
  },
  methods: {
    async init() {
      let content = await this.$Model.General.getNoticeManage(this.noticeId);
      if (content) {
        this.content = content;
        let { operations } = content;
        this.navigation = [];
        operations.forEach((item: number, index: number) => {
          let eachIndex = operations[index];
          if (
            [ENoticeOperation.审核, ENoticeOperation.上线, ENoticeOperation.下线, ENoticeOperation.删除].includes(
              eachIndex
            )
          ) {
            let text = ['编辑', '提交', '审核', '上线', '下线', '删除'][eachIndex - 1];
            let type = ['edit', 'commit', 'audit', 'publish', 'unpublish', 'delete'][eachIndex - 1];
            let icon = [
              '',
              '',
              require('./_images/icon-audit.png'),
              require('./_images/icon-publish.png'),

              require('./_images/icon-unpublish.png'),
              require('./_images/icon-delete.png')
            ][eachIndex - 1];
            this.navigation.push({ text, type, icon });
          }
        });
      }
    },
    switchTo(type: string) {
      switch (type) {
        case 'audit':
          this.isAuditVisible = true;
          break;
        case 'delete':
          this.deleteNotice();
          break;
        case 'publish':
          this.publish();
          break;
        case 'unpublish':
          this.unpublish();
          break;
        default:
          break;
      }
    },
    async audit({ pass, comment }: any) {
      await this.$Model.General.postAuditNotice(this.noticeId, {
        pass,
        body: comment
      });
      this.isAuditVisible = false;
      this.init();
    },
    async deleteNotice() {
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.General.deleteNotice(this.noticeId);
        this.$toast('删除成功');
        //@ts-ignore
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    async publish() {
      await this.$Model.General.postPublishNotice(this.noticeId);
      this.$toast('上线成功');
      this.init();
    },
    async unpublish() {
      await this.$Model.General.postUnpublishNotice(this.noticeId);
      this.$toast('下线成功');
      this.init();
    }
  }
});
</script>

<style lang="scss">
.page-general-notice-manage-content {
  &__main {
    padding: 0 16px;
  }

  &__title {
    font-size: 20px;
    font-weight: 400;
    color: #000000;
    text-align: justify;
    margin: 18px 0;
  }

  &__description {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    span,
    time {
      margin-right: 16px;
    }

    &_status {
      display: inline-block;
      text-align: center;
      width: 58px;
      height: 24px;
      line-height: 24px;
      border-radius: 4px;
      white-space: nowrap;
      &.--online {
        color: #3ed0af;
        background: rgba(62, 208, 175, 0.1);
      }
      &.--pending {
        color: #ffae33;
        background: #fff6ea;
      }
      &.--fail {
        color: #f56c6b;
        background: #fef1f1;
      }
      &.--offline,
      &.--draft {
        color: #666666;
        background: #ebebeb;
      }
      &.--pass {
        color: #1890ff;
        background: rgba(#1890ff, 0.1);
      }
    }
  }

  .h-parse-body article {
    padding: 10px 0 70px;
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
