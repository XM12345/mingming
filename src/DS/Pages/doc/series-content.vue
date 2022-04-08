<template>
  <div :class="[B()]">
    <h-topbar :title="content.title"></h-topbar>

    <div :class="[B('__main')]" :style="{ 'padding-bottom': navigation.length ? '70px' : '0' }">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="docs">
          <div :class="[B('__intro')]">
            <div :class="[B('__intro_message')]">
              <p :class="[B('__intro_title')]">{{ content.title }}</p>
              <div :class="[B('__intro_user')]">
                <span>创建者: {{ content.creator_nickname || content.creator_username }}</span>
                <time>创建时间: {{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
              </div>
            </div>
            <mark v-if="content.status_name" :class="[B('__intro_state')]">{{ content.status_name }}</mark>
          </div>
          <doc--list-sheet v-if="content.items" :items="content.items"></doc--list-sheet>
        </div>
        <div ref="message">
          <base--list-message v-if="content.id" :content="content" type="series"></base--list-message>
        </div>
        <div ref="attachments">
          <base--list-attachments :mediumId="seriesId" type="series"></base--list-attachments>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="seriesId" type="series"></base--list-comments>
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
enum ESeriesOperateAble {
  修改 = 1,
  审核 = 2,
  删除 = 3,
  恢复 = 4,
  撤销 = 5,
  批注 = 6,
  提交 = 9,
  彻底删除 = 10
}

export default Vue.extend({
  name: 'page-doc-series-content',
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '文稿列表', key: 'docs' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '批注', key: 'comments' }
      ],
      content: {} as any,
      isAudit: false,
      isComment: false,
      navigation: [] as { text: string; type: string; icon: string }[],
      seriesId: 0,
      operateStatus: -1
    };
  },
  created() {
    let { series_id } = this.$route.params;
    this.seriesId = Number(series_id) || 0;
    this.tabKey = this.navItems[0].key || '';
    this.init();
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshState = this.init;
    }
  },
  methods: {
    init() {
      this.$Model.Doc.series(this.seriesId).then(data => {
        this.content = data;
        this.$title(data.title);
        let { operate_able } = data;
        this.navigation = [];

        operate_able.forEach((item: any, index: number) => {
          let eachIndex = operate_able[index];
          if (
            [
              ESeriesOperateAble.修改,
              ESeriesOperateAble.审核,
              ESeriesOperateAble.删除,
              ESeriesOperateAble.恢复,
              ESeriesOperateAble.撤销,
              ESeriesOperateAble.批注,
              ESeriesOperateAble.提交,
              ESeriesOperateAble.彻底删除
            ].includes(eachIndex)
          ) {
            let text = ['编辑', '审核', '删除', '恢复', '撤销', '批注', '', '', '提交', '彻底删除'][eachIndex - 1];
            let type = ['edit', 'audit_', 'delete', 'recover', 'revoke', 'comment', '', '', 'publish', 'delFinal'][
              eachIndex - 1
            ];
            let icon = [
              require('./_images/edit@2x.png'),
              require('./_images/audit_@2x.png'),
              require('./_images/delete@2x.png'),
              require('./_images/recover@2x.png'),
              require('./_images/revoke@2x.png'),
              require('./_images/comment@2x.png'),
              '',
              '',
              require('./_images/publish@2x.png'),
              require('./_images/delFinal@2x.png')
            ][eachIndex - 1];
            this.navigation.push({ text, type, icon });
          }
        });
        // 获取可撤销/退回状态
        this.$Model.Doc.revoke_status(this.seriesId).then(data => {
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
        case 'edit':
          this.$router.push(`/docs/series/edit/${this.seriesId}`);
          break;
        case 'audit_':
          this.isAudit = true;
          break;
        case 'delete':
          this.del();
          break;
        case 'recover':
          this.restore();
          break;
        case 'revoke':
          this.revoke();
          break;
        case 'comment':
          this.isComment = true;
          break;
        case 'publish':
          this.commit();
          break;
        case 'delFinal':
          this.delFinal();
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
      await this.$Model.Doc.post_audit(this.seriesId, data);
      this.isAudit = false;
      window.DfsxWeb?.freshComment?.(); // 刷新批注
      this.init(); // 刷新审核
    },
    // 撤销
    async revoke() {
      if (await this.$confirm('确定要撤销吗？')) {
        await this.$Model.Doc.revoke(this.seriesId, {
          status: this.operateStatus
        });
        this.init();
        this.$toast('撤销成功');
      }
    },
    // 还原
    async restore() {
      if (await this.$confirm('确定要恢复吗？')) {
        await this.$Model.Doc.restore([this.seriesId]);
        this.cleanRoutes();
        this.$router.back();
      }
    },
    // 删除
    async del() {
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Doc.delete_series(this.seriesId);
        this.cleanRoutes();
        this.$router.back();
      }
    },
    // 彻底删除
    async delFinal() {
      if (await this.$confirm('确定要彻底删除吗？')) {
        await this.$Model.Doc.delFinal(this.seriesId);
        this.cleanRoutes();
        this.$router.back();
      }
    },
    // 批注
    async comment(text: string) {
      await this.$Model.Doc.series_addComments(this.seriesId, JSON.stringify(text));
      this.isComment = false;
      window.DfsxWeb?.freshComment?.(); // 刷新批注
    },
    // 提交
    async commit() {
      if (await this.$confirm('确定要提交吗？')) {
        await this.$Model.Doc.commit(this.seriesId);
        this.init();
        this.$toast('提交成功');
      }
    },
    cleanRoutes() {
      //@ts-ignore
      this.$navigation.cleanRoutes();
    }
  }
});
</script>

<style lang="scss">
.page-doc-series-content {
  background: #f4f6f9;

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
}
</style>
