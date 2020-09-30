<template>
  <div class="page-weixin-content page-detail">
    <base--topbar title="微信文稿详情"></base--topbar>
    <div
      class="page-weixin-content-main page-detail-main"
      :style="{ 'padding-bottom': operate_able.length ? '70px' : '0' }"
    >
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="message">
          <base--list-message :content="content" type="weixin" v-if="content"></base--list-message>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="content_id" :accountId="account_id" type="weixin"></base--list-comments>
        </div>
        <div ref="records">
          <base--list-operlog :mediumId="content_id" :accountId="account_id" type="weixin"></base--list-operlog>
        </div>
      </base--tab>
    </div>
    <footer class="s-footer" v-if="operate_able.length">
      <span :class="`s-${item.key}`" v-for="item in operate_able" :key="item.key" @click="handle(item.key)">{{
        item.name
      }}</span>
    </footer>
    <!-- 审核 -->
    <mt-popup class="mint-popup-audit" v-model="isAudit" position="bottom">
      <footer>
        <input placeholder="请输入审核意见" v-model="comment" />
        <button class="s-fail" @click="pass(false)">退回</button>
        <button class="s-success" @click="pass(true)">通过</button>
      </footer>
    </mt-popup>
    <!-- 批注 -->
    <mt-popup class="mint-popup-comment" v-model="isComment" position="bottom">
      <footer>
        <input placeholder="我想说..." v-model.trim="text" />
        <button class="s-success" @click="comments">发表</button>
      </footer>
    </mt-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      account_name: '',
      account_id: undefined,
      content_id: undefined,
      tabKey: '',
      navItems: [
        { name: '基本信息', key: 'message' },
        { name: '批注', key: 'comments' },
        { name: '操作纪录', key: 'records' }
      ],
      operate_able: [],
      isAudit: false,
      isComment: false,
      text: '',
      comment: '',
      operate_status: -1
    };
  },
  created() {
    let { params } = this.$route;
    let { account_id, content_id } = params;
    this.account_id = account_id;
    this.content_id = content_id;
    this.tabKey = this.navItems[0].key || '';
    this.$Model.Weixin.accounts().then(data => {
      let account = data.find(item => item.id == account_id);
      this.account_name = account.name;
    });
    this.init();
  },
  methods: {
    init() {
      this.$Model.Weixin.content(this.account_id, this.content_id).then(data => {
        this.content = data;
        this.content.accountName = this.account_name;
        let { operateAble } = data;
        operateAble = Array.from(new Set(operateAble)); // 剔除重复
        this.operate_able = [];
        // 1-修改，2-审核，3-删除，4-恢复，5-撤销，6-批注，7-预览，8-群发, 9-提交
        operateAble.forEach((item, index) => {
          let eachIndex = operateAble[index];
          if ([2, 3, 5, 6, 8, 9].includes(eachIndex)) {
            let name = ['编辑', '审核', '删除', '恢复', '撤销', '批注', '预览', '发布', '提交'][eachIndex - 1];
            let key = ['edit', 'audit_', 'delete', 'recover', 'revoke', 'comment', 'preview', 'publish', 'accept'][
              eachIndex - 1
            ];
            this.operate_able.push({ name, key });
          }
        });
        // 获取可撤销/退回状态
        this.$Model.Weixin.status(this.account_id, this.content_id).then(data => {
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
      switch (key) {
        case 'audit_':
          this.isAudit = true;
          break;
        case 'delete':
          this.del();
          break;
        case 'revoke':
          this.revoke();
          break;
        case 'comment':
          this.isComment = true;
          break;
        case 'publish':
          this.publish();
          break;
        case 'accept':
          this.commit();
          break;
        default:
          break;
      }
    },
    pass(is_approved) {
      // 审核true/false
      let data = {
        is_approved: is_approved,
        comment: this.comment,
        status: this.operate_status
      };
      this.$Model.Weixin.audit(this.account_id, this.content_id, data).then(() => {
        this.isAudit = false;
        this.comment = '';
        // 刷新批注
        window.DfsxWeb.freshComment();
        // 刷新操作纪录
        window.DfsxWeb.freshLogs();
        this.init();
      });
    },
    revoke() {
      // 撤销
      this.$messagebox.confirm('确定要撤销吗？').then(action => {
        this.$Model.Weixin.revoke(this.account_id, this.content_id, this.operate_status).then(() => {
          this.init();
          this.$toast('撤销成功');
        });
      });
    },
    del() {
      // 删除
      this.$messagebox.confirm('确定要删除吗？').then(action => {
        this.$Model.Weixin.delete(this.account_id, this.content_id).then(() => {
          this.$toast('删除成功');
          this.$navigation.cleanRoutes();
          this.$router.back();
        });
      });
    },
    comments() {
      // 批注
      if (this.text != '') {
        this.$Model.Weixin.addComments(this.account_id, this.content_id, JSON.stringify(this.text)).then(data => {
          this.isComment = false;
          // 刷新批注
          window.DfsxWeb.freshComment();
          // 刷新操作纪录
          window.DfsxWeb.freshLogs();
          this.text = '';
        });
      } else {
        this.$toast('批注不能为空');
      }
    },
    publish() {
      let { account_id, content_id } = this;
      this.$router.push(`/weixin/${account_id}/content/${content_id}/publish/now`);
    },
    commit() {
      // 提交群发图文
      let { account_id, content_id } = this;
      this.$messagebox.confirm('确定要提交吗？').then(action => {
        this.$Model.Weixin.commit(account_id, content_id).then(() => {
          this.$toast('提交成功');
          this.init();
        });
      });
    }
  }
};
</script>

<style lang="scss">
.page-weixin-content {
  .s-footer {
    @each $img in audit_, revoke, delete, comment, publish, accept {
      span.s-#{$img} {
        background-image: url('../doc/_images/#{$img}@2x.png');
      }
    }
  }
}
</style>
