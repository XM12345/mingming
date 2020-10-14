<template>
  <div class="page-weibo-content page-detail">
    <base--topbar :title="content.title"></base--topbar>
    <div class="page-detail-main" :style="{ 'padding-bottom': operate_able.length ? '70px' : '0' }">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{ content.title }}</p>
              <footer>
                <span>创建者: {{ content.creator_nickname || content.creator_username }}</span>
                <time>创建时间: {{ content.creation_time | ds_time('yyyy-MM-dd hh:mm') }}</time>
              </footer>
            </div>
            <!-- 1、审核中，2、审核完成（已通过或无审核流程），3、已发布，4、已回收 -->
            <mark v-if="content.state">{{ content.state | filter_state }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
          <div class="s-insert-img">
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
          <base--list-message :content="content" type="weibo" v-if="content"></base--list-message>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="article_id" type="weibo"></base--list-comments>
        </div>
      </base--tab>
    </div>
    <footer class="s-footer" v-if="operate_able.length">
      <span
        :class="[`s-${item.key}`, item.key == 'collect' && content.has_collection ? 'has_collection' : '']"
        v-for="item in operate_able"
        :key="item.key"
        @click="handle(item.key)"
        >{{ item.name }}</span
      >
    </footer>
    <mt-popup class="mint-popup-audit" v-model="isAudit" position="bottom">
      <footer>
        <input placeholder="请输入审核意见" v-model="comment" />
        <button class="s-fail" @click="pass(false)">退回</button>
        <button class="s-success" @click="pass(true)">通过</button>
      </footer>
    </mt-popup>
    <mt-popup class="mint-popup-comment" v-model="isComment" position="bottom">
      <footer>
        <input placeholder="我想说..." v-model.trim="text" />
        <button class="s-success" @click="comments">发表</button>
      </footer>
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      account_id: undefined,
      article_id: undefined,
      content: '',
      comment: '',
      isComment: false,
      isAudit: false,
      operate_able: [
        { key: 'audit_', name: '审核' },
        { key: 'delete', name: '删除' },
        { key: 'publish', name: '发布' },
        /* { key: 'collect', name: '收藏' }, */
        { key: 'comment', name: '批注' }
      ],
      tabKey: '',
      text: '',
      navItems: [
        { name: '文稿内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '批注', key: 'comments' }
      ]
    };
  },
  created() {
    let { params } = this.$route;
    let { article_id } = params;
    this.article_id = article_id;
    this.tabKey = this.navItems[0].key || '';
    this.init();
  },
  filters: {
    filter_state(state) {
      return ['审核中', '已通过', '已发布', '已回收'][state - 1];
    }
  },
  methods: {
    init() {
      this.$Model.Weibo.article(this.article_id).then(data => {
        this.content = data;
        this.$title(data.title);
        let { account } = data;
        let { account_id } = account;
        this.account_id = account_id;
        data.mobjects.map(item => {
          if (item.url.match(/.mp4/)) {
            item.type = 2;
          } else {
            item.type = 1;
          }
          return item;
        });
      });
    },
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    },
    play(id) {
      this.$refs[id][0].play();
      this.$refs[id][0].nextSibling.hidden = true;
    },
    handle(key) {
      if (key == 'comment') {
        this.isComment = true;
      } else if (key == 'delete') {
        this.del();
      } else if (key == 'audit_') {
        this.isAudit = true;
      } else if (key == 'publish') {
        this.publish();
      } else if (key == 'collect') {
        this.collect();
      }
    },
    comments() {
      // 批注
      let data = { content: this.text };
      if (this.text != '') {
        this.$Model.Weibo.addPostils(this.article_id, data).then(data => {
          this.isComment = false;
          // 刷新批注
          window.DfsxWeb.freshComment();
          this.text = '';
        });
      } else {
        this.$toast('批注不能为空');
      }
    },
    del() {
      // 删除
      this.$messagebox.confirm('确定要删除吗？').then(action => {
        this.$Model.Weibo.delete(this.article_id).then(() => {
          this.$navigation.cleanRoutes();
          this.$router.back();
        });
      });
    },
    pass(isPass) {
      let data = {
        pass: isPass,
        content: this.comment
      };
      this.$Model.Weibo.audit(this.article_id, data).then(() => {
        this.isAudit = false;
        this.comment = '';
        // 刷新批注
        window.DfsxWeb.freshComment();
      });
    },
    publish() {
      // 发布
      let { article_id } = this;
      this.$router.push(`/weibo/articles/${article_id}/push`);
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
};
</script>

<style lang="scss">
.page-weibo-content {
  .s-insert-img {
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
  .s-footer {
    @each $img in audit_, comment, delete, publish {
      span.s-#{$img} {
        background-image: url('../doc/_images/#{$img}@2x.png');
      }
    }
    .s-collect {
      background-image: url('./_images/collect@2x.png');
    }
    .has_collection {
      background-image: url('./_images/collected@2x.png') !important;
    }
  }
}
</style>
