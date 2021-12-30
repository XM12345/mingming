<template>
  <div class="page-weixin-content page-detail">
    <h-topbar title="微信文稿详情"></h-topbar>
    <div
      class="page-weixin-content-main page-detail-main"
      :style="{ 'padding-bottom': operate_able.length ? '70px' : '0' }"
    >
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="message">
          <base--list-message :content="content" type="weixin" v-if="content"></base--list-message>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="content_id" :accountId="account_id" type="weixin"></base--list-comments>
        </div>
        <div ref="records">
          <base--list-operlog :mediumId="content_id" :accountId="account_id" type="weixin"></base--list-operlog>
        </div>
      </h-tab>
    </div>
    <footer class="s-footer" v-if="operate_able.length">
      <span :class="`s-${item.key}`" v-for="item in operate_able" :key="item.key" @click="handle(item.key)">{{
        item.name
      }}</span>
    </footer>
    <!-- 审核 -->
    <base--popup-audit @audit="audit" v-model="isAudit"></base--popup-audit>
    <!-- 批注 -->
    <base--popup-comment @comment="comment" v-model="isComment"></base--popup-comment>
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
    async audit({ pass, comment }) {
      let data = {
        is_approved: pass,
        comment,
        status: this.operate_status
      };
      await this.$Model.Weixin.audit(this.account_id, this.content_id, data);
      this.isAudit = false;
      window.DfsxWeb.freshComment(); // 刷新批注
      window.DfsxWeb.freshLogs(); // 刷新操作纪录
      this.init();
    },
    async revoke() {
      // 撤销
      if (await this.$confirm('确定要撤销吗？')) {
        await this.$Model.Weixin.revoke(this.account_id, this.content_id, this.operate_status);
        this.init();
        this.$toast('撤销成功');
      }
    },
    async del() {
      // 删除
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Weixin.delete(this.account_id, this.content_id);
        this.$toast('删除成功');
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    async comment(text) {
      // 批注
      await this.$Model.Weixin.addComments(this.account_id, this.content_id, JSON.stringify(text));
      this.isComment = false;
      window.DfsxWeb.freshComment(); // 刷新批注
      window.DfsxWeb.freshLogs(); // 刷新操作纪录
    },
    publish() {
      let { account_id, content_id } = this;
      this.$router.push(`/weixin/${account_id}/content/${content_id}/publish/now`);
    },
    async commit() {
      // 提交群发图文
      if (await this.$confirm('确定要提交吗？')) {
        await this.$Model.Weixin.commit(this.account_id, this.content_id);
        this.$toast('提交成功');
        this.init();
      }
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
