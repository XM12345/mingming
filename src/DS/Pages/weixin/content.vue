<template>
  <div :class="[B()]">
    <h-topbar title="微信文稿详情"></h-topbar>

    <div :class="[B('__main')]" :style="{ 'padding-bottom': navigation.length ? '70px' : '0' }">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="message">
          <base--list-message v-if="contentId" :content="content" type="weixin"></base--list-message>
        </div>
        <div ref="comments">
          <weixin--list-comments :contentId="contentId" :accountId="accountId"></weixin--list-comments>
        </div>
        <div ref="records">
          <weixin--list-logs :contentId="contentId" :accountId="accountId"></weixin--list-logs>
        </div>
      </h-tab>
    </div>

    <h-navigation
      v-if="navigation.length"
      :navigation="navigation"
      :height="70"
      :iconSize="35"
      @switch="switchTo"
    ></h-navigation>

    <!-- 审核 -->
    <base--popup-audit v-model="isAudit" @audit="audit"></base--popup-audit>
    <!-- 批注 -->
    <base--popup-comment v-model="isComment" @comment="comment"></base--popup-comment>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
enum EWeixinOperateAble {
  修改 = 1,
  审核 = 2,
  删除 = 3,
  恢复 = 4,
  撤销 = 5,
  批注 = 6,
  预览 = 7,
  群发 = 8,
  提交 = 9
}

export default Vue.extend({
  name: 'page-weixin-content',
  data() {
    return {
      content: {} as any,
      accountName: '',
      accountId: 0,
      contentId: 0,
      tabKey: '',
      navItems: [
        { name: '基本信息', key: 'message' },
        { name: '批注', key: 'comments' },
        { name: '操作纪录', key: 'records' }
      ],
      navigation: [] as { text: string; type: string; icon: string }[],
      isAudit: false,
      isComment: false,
      operateStatus: -1
    };
  },
  created() {
    let { account_id, content_id } = this.$route.params;
    this.accountId = Number(account_id) || 0;
    this.contentId = Number(content_id) || 0;
    this.tabKey = this.navItems[0].key || '';
    this.$Model.Weixin.accounts().then(data => {
      let account = data.find((item: any) => item.id === this.accountId);
      this.accountName = account.name;
    });
    this.init();
  },
  methods: {
    init() {
      this.$Model.Weixin.content(this.accountId, this.contentId).then(data => {
        this.content = data;
        this.content.accountName = this.accountName;
        let { operateAble } = data;
        operateAble = Array.from(new Set(operateAble)); // 剔除重复
        this.navigation = [];

        operateAble.forEach((item: any, index: number) => {
          let eachIndex = operateAble[index];
          if (
            [
              EWeixinOperateAble.审核,
              EWeixinOperateAble.删除,
              EWeixinOperateAble.撤销,
              EWeixinOperateAble.批注,
              EWeixinOperateAble.群发,
              EWeixinOperateAble.提交
            ].includes(eachIndex)
          ) {
            let text = ['编辑', '审核', '删除', '恢复', '撤销', '批注', '预览', '发布', '提交'][eachIndex - 1];
            let type = ['edit', 'audit_', 'delete', 'recover', 'revoke', 'comment', 'preview', 'publish', 'accept'][
              eachIndex - 1
            ];
            let icon = [
              '',
              require('../doc/_images/audit_@2x.png'),
              require('../doc/_images/delete@2x.png'),
              '',
              require('../doc/_images/revoke@2x.png'),
              require('../doc/_images/comment@2x.png'),
              '',
              require('../doc/_images/publish@2x.png'),
              require('../doc/_images/accept@2x.png')
            ][eachIndex - 1];
            this.navigation.push({ text, type, icon });
          }
        });
        // 获取可撤销/退回状态
        this.$Model.Weixin.status(this.accountId, this.contentId).then(data => {
          if (data.length) {
            this.operateStatus = data[0].status;
          }
        });
      });
    },
    onSwitch(key: string) {
      this.tabKey = key;
      this.$nextTick(() => {
        (this.$refs[key] as any)?.scrollIntoView();
      });
    },
    switchTo(key: string) {
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
    async audit({ pass, comment }: any) {
      let data = {
        is_approved: pass,
        comment,
        status: this.operateStatus
      };
      await this.$Model.Weixin.audit(this.accountId, this.contentId, data);
      this.isAudit = false;
      window.DfsxWeb?.freshComment?.(); // 刷新批注
      window.DfsxWeb?.freshLogs?.(); // 刷新操作纪录
      this.init();
    },
    // 撤销
    async revoke() {
      if (await this.$confirm('确定要撤销吗？')) {
        await this.$Model.Weixin.revoke(this.accountId, this.contentId, this.operateStatus);
        this.init();
        this.$toast('撤销成功');
      }
    },
    // 删除
    async del() {
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Weixin.delete(this.accountId, this.contentId);
        this.$toast('删除成功');
        //@ts-ignore
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    // 批注
    async comment(text: string) {
      await this.$Model.Weixin.addComments(this.accountId, this.contentId, JSON.stringify(text));
      this.isComment = false;
      window.DfsxWeb?.freshComment?.(); // 刷新批注
      window.DfsxWeb?.freshLogs?.(); // 刷新操作纪录
    },
    publish() {
      this.$router.push(`/weixin/${this.accountId}/content/${this.contentId}/publish/now`);
    },
    // 提交群发图文
    async commit() {
      if (await this.$confirm('确定要提交吗？')) {
        await this.$Model.Weixin.commit(this.accountId, this.contentId);
        this.$toast('提交成功');
        this.init();
      }
    }
  }
});
</script>

<style lang="scss">
.page-weixin-content {
  background: #f4f6f9;
}
</style>
