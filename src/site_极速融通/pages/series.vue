<template>
  <div class="page-sheet-detail page-detail">
    <h-topbar :title="content.title"></h-topbar>
    <div class="page-detail-main" :style="{'bottom':operate_able.length ? '70px' : '0'}">
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="docs">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{content.title}}</p>
              <footer>
                <span>创建者: {{content.creator_nickname || content.creator_username}}</span>
                <time>创建时间: {{content.creation_time | ds_time}}</time>
              </footer>
            </div>
            <mark>{{content.status | filter_status}}</mark>
          </div>
          <list-sheet :items="content.items" v-if="content.items"></list-sheet>
        </div>
        <div ref="message">
          <list-message :content="content" type="series" v-if="content"></list-message>
        </div>
        <div ref="comments">
          <list-comments
            :mediumId="series_id"
            :isComment="isComment"
            :isAudit="isAudit"
            type="series"
          ></list-comments>
        </div>
      </h-tab>
    </div>
    <footer class="s-footer" v-if="operate_able.length">
      <span
        :class="`s-${item.key}`"
        v-for="item in operate_able"
        :key="item.key"
        @click="handle(item.key)"
      >{{item.name}}</span>
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
    <mt-popup class="mint-popup-delete" v-model="isDelete" position="center">
      <div class="s-de">
        <p>提示</p>
          <p class="s-de-info">是否确定删除此串联单？</p>
        <div>
          <button class="s-de-cancel" @click="cancel">取消</button>
          <button class="s-de-confirm" @click="del">删除</button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '文稿列表', key: 'docs' },
        { name: '基本信息', key: 'message' },
        { name: '批注', key: 'comments' }
      ],
      content: '',
      isAudit: false,
      isComment: false,
      isDelete: false,
      operate_able: [],
      comment: '',
      series_id: undefined,
      text: '',
      operate_status: -1
    };
  },
  created() {
    let { params } = this.$route;
    let { series_id } = params;
    this.series_id = series_id;
    this.tabKey = this.navItems[0].key || '';
    this.init();
  },
  filters: {
    filter_status(status) {
      return ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过'][status];
    }
  },
  methods: {
    init() {
      this.$Model.Doc.series(this.series_id).then(data => {
        this.content = data;
        this.$title(data.title);
        let { operate_able } = data;
        this.operate_able = [];
        // 2-审核，3-删除，4-恢复，5-撤销，6-批注, 9- 提交, 10-彻底删除
        operate_able.forEach((item, index) => {
          if (operate_able[index] == 2) {
            this.operate_able.push({ name: '审核', key: 'audit_' });
          } else if (operate_able[index] == 3) {
            this.operate_able.push({ name: '删除', key: 'delete' });
          } else if (operate_able[index] == 4) {
            this.operate_able.push({ name: '恢复', key: 'recover' });
          } else if (operate_able[index] == 5) {
            this.operate_able.push({ name: '撤销', key: 'revoke' });
          } else if (operate_able[index] == 6) {
            this.operate_able.push({ name: '批注', key: 'comment' });
          } else if (operate_able[index] == 9) {
            this.operate_able.push({ name: '提交', key: 'publish' });
          } else if (operate_able[index] == 10) {
            this.operate_able.push({ name: '彻底删除', key: 'delFinal' });
          }
        });
        // 获取可撤销/退回状态
        this.$Model.Doc.revoke_status(this.series_id).then(data => {
          if (data.length) {
            this.operate_status = data[0].status;
          }
        });
      });
    },
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    },
    handle(key) {
      if (key == 'audit_') {
        this.isAudit = true;
      } else if (key == 'delete') {
        this.isDelete = true;
      } else if (key == 'revoke') {
        this.revoke();
      } else if (key == 'comment') {
        this.isComment = true;
      } else if (key == 'publish') {
        this.commit();
      } else if (key == 'delFinal') {
        this.delFinal();
      } else if (key == 'recover') {
        this.restore();
      }
    },
    pass(is_approved) {
      // 审核true/false
      let data = {
        is_approved: is_approved,
        comment: this.comment,
        status: this.operate_status
      };
      this.$Model.Doc.post_audit(this.series_id, data).then(() => {
        this.isAudit = false;
        this.comment = '';
        this.init(); // 刷新审核
      });
    },
    revoke() {
      // 撤销
      let data = {
        status: this.operate_status
      };
      this.$Model.Doc.revoke(this.series_id, data).then(() => {
        this.init();
        this.$toast('撤销成功');
      });
    },
    restore() {
      // 还原
      let ids = [this.series_id];
      this.$Model.Doc.restore(ids).then(() => {
        this.$router.back();
      });
    },
    del() {
      // 删除
      this.$Model.Doc.delete_series(this.series_id).then(() => {
        this.$router.back();
      });
    },
    delFinal() {
      // 彻底删除
      this.$Model.Doc.delFinal(this.series_id).then(() => {
        this.$router.back();
      });
    },
    cancel() {
      this.isDelete = false;
    },
    comments() {
      // 批注post
      if (this.text != '') {
        this.$Model.Doc.series_addComments(this.series_id, JSON.stringify(this.text)).then(data => {
          this.isComment = false;
          this.text = '';
        });
      } else {
        this.$toast('批注不能为空');
      }
    },
    commit() {
      // 提交
      this.$Model.Doc.commit(this.series_id).then(() => {
        this.init();
        this.$toast('提交成功');
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == '串联单搜索') {
      to.meta.isKeepLive = true;
    }
    next();
  }
};
</script>


<style lang="scss">
.page-sheet-detail {
  .s-footer {
    @each $img in audit_, revoke, delete, comment, publish, delFinal, recover {
      span.s-#{$img} {
        background-image: url('../images/detail/#{$img}@2x.png');
      }
    }
  }
}
</style>
