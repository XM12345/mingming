<template>
  <div :class="[B()]">
    <h-topbar :title="content.title"></h-topbar>
    <div :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="content" :class="[B('__content')]">
          <div :class="[B('__intro')]">
            <div :class="[B('__intro_message')]">
              <p :class="[B('__intro_title')]">{{ content.title }}</p>
              <div :class="[B('__intro_user')]">
                <span>创建者: {{ content.creator_nickname || content.creator_username }}</span>
                <time>创建时间: {{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
              </div>
            </div>
            <mark v-if="content.state" :class="[B('__intro_state')]">{{ stateName(content.state) }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
          <div :class="[B('__mobjects')]">
            <div>
              <section v-for="item in content.mobjects" :key="item.id">
                <video :src="item.url" :poster="item.cover_url" v-if="item.type == 2" :ref="item.id"></video>
                <img :src="item.url" alt v-else />
                <mark v-if="item.type == 2" @click="play(item.id)"></mark>
              </section>
            </div>
          </div>
        </div>
        <div ref="message">
          <base--list-message v-if="content.id" :content="content" type="weibo"></base--list-message>
        </div>
        <div ref="comments">
          <weibo--list-comments :articleId="articleId"></weibo--list-comments>
        </div>
      </h-tab>
    </div>
    <h-navigation :navigation="navigation" :height="70" :iconSize="35" @switch="handle"></h-navigation>
    <!-- 审核 -->
    <base--popup-audit v-model="isAudit" @audit="audit"></base--popup-audit>
    <!-- 批注 -->
    <base--popup-comment v-model="isComment" @comment="comment"></base--popup-comment>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weibo-content',
  data() {
    return {
      accountId: 0,
      articleId: 0,
      content: {} as any,
      isComment: false,
      isAudit: false,
      navigation: [
        { type: 'audit_', text: '审核', icon: require('../doc/_images/audit_@2x.png') },
        { type: 'delete', text: '删除', icon: require('../doc/_images/delete@2x.png') },
        { type: 'publish', text: '发布', icon: require('../doc/_images/publish@2x.png') },
        { type: 'comment', text: '批注', icon: require('../doc/_images/comment@2x.png') }
      ],
      tabKey: '',
      navItems: [
        { name: '文稿内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '批注', key: 'comments' }
      ]
    };
  },
  created() {
    let { article_id } = this.$route.params;
    this.articleId = Number(article_id) || 0;
    this.tabKey = this.navItems[0].key || '';
    this.init();
  },
  methods: {
    async init() {
      let content = await this.$Model.Weibo.article(this.articleId);
      if (content) {
        this.content = content;
        this.$title(content.title);
        this.accountId = content.account?.account_id || 0;
        content.mobjects.map((item: any) => {
          if (item.url.match(/.mp4/)) {
            item.type = 2;
          } else {
            item.type = 1;
          }
          return item;
        });
      }
    },
    stateName(state: number) {
      return ['审核中', '已通过', '已发布', '已回收'][state - 1];
    },
    onSwitch(key: string) {
      this.tabKey = key;
      this.$nextTick(() => {
        (this.$refs[key] as any)?.scrollIntoView();
      });
    },
    play(id: number) {
      (this.$refs[id] as any)[0].play();
      (this.$refs[id] as any)[0].nextSibling.hidden = true;
    },
    handle(key: string) {
      if (key === 'comment') {
        this.isComment = true;
      } else if (key === 'delete') {
        this.del();
      } else if (key === 'audit_') {
        this.isAudit = true;
      } else if (key === 'publish') {
        this.publish();
      } else if (key === 'collect') {
        this.collect();
      }
    },
    // 批注
    async comment(text: string) {
      await this.$Model.Weibo.addPostils(this.articleId, { content: text });
      this.isComment = false;
      window.DfsxWeb?.freshComment?.(); // 刷新批注
    },
    // 删除
    async del() {
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Weibo.delete(this.articleId);
        // @ts-ignore
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    async audit({ pass, comment }: any) {
      await this.$Model.Weibo.audit(this.articleId, { pass, comment });
      this.isAudit = false;
      window.DfsxWeb?.freshComment?.(); // 刷新批注
    },
    // 发布
    publish() {
      this.$router.push(`/weibo/articles/${this.articleId}/push`);
    },
    collect() {
      this.content.has_collection = !this.content.has_collection;
      let { id, has_collection } = this.content;
      if (has_collection) {
        this.$Model.Weibo.collect(id).then(() => {
          this.$toast('收藏成功');
        });
      } else {
        this.$Model.Weibo.cancel(id).then(() => {
          this.$toast('取消收藏成功');
        });
      }
    }
  }
});
</script>

<style lang="scss">
.page-weibo-content {
  background: #f4f6f9;

  &__main {
    padding-bottom: 70px;
  }
  &__content {
    border-bottom: 10px solid #f4f6f9;
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
      img {
        width: 30px;
        height: 15px;
        padding: 0 2px;
        object-fit: contain !important;
      }
    }
    &_user {
      font-size: 12px;
      color: #999;
      time {
        padding: 0 10px;
      }
    }
    &_state {
      font-size: 12px;
      background: none;
      color: #1890ff;
      border: 1px solid #1890ff;
      padding: 2px 10px;
      border-radius: 3px;
      white-space: nowrap;
      margin-left: 10px;
    }
  }
  &__mobjects {
    padding: 0 15px 10px;
    div {
      font-size: 0;
      section {
        display: inline-block;
        position: relative;
        width: 33.3%;
        min-height: 80px;
        img,
        video {
          display: inline-block;
          width: 100%;
          height: 23vw;
          border: 2px solid #fff;
        }
        video {
          object-fit: fill;
        }
        mark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 23px;
          height: 23px;
          background: url('./_images/play.png');
          background-repeat: no-repeat;
          background-size: 100%;
          background-position: center center;
        }
      }
    }
  }
  .h-parse-body article {
    padding: 10px 15px;
  }
}
</style>
