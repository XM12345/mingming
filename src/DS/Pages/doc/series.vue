<template>
  <div class="page-sheet-detail page-detail">
    <base--topbar :title="content.title"></base--topbar>
    <div class="page-detail-main" :style="{ 'padding-bottom': operate_able.length ? '70px' : '0' }">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="docs">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{ content.title }}</p>
              <footer>
                <span>创建者: {{ content.creator_nickname || content.creator_username }}</span>
                <time>创建时间: {{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
              </footer>
            </div>
            <mark v-if="content.status_name">{{ content.status_name }}</mark>
          </div>
          <doc--list-sheet :items="content.items" v-if="content.items"></doc--list-sheet>
        </div>
        <div ref="message">
          <base--list-message :content="content" type="series" v-if="content"></base--list-message>
        </div>
        <div ref="attachments">
          <base--list-attachments :mediumId="series_id" type="series"></base--list-attachments>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="series_id" type="series"></base--list-comments>
        </div>
      </base--tab>
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
      tabKey: '',
      navItems: [
        { name: '文稿列表', key: 'docs' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '批注', key: 'comments' }
      ],
      content: '',
      isAudit: false,
      isComment: false,
      operate_able: [],
      series_id: undefined,
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
  mounted() {
    // app 刷新状态
    window.DfsxWeb.freshState = this.init;
  },
  methods: {
    init() {
      this.$Model.Doc.series(this.series_id).then(data => {
        this.content = data;
        this.$title(data.title);
        let { operate_able } = data;
        this.operate_able = [];
        // 1-修改,2-审核，3-删除，4-恢复，5-撤销，6-批注, 9- 提交, 10-彻底删除
        operate_able.forEach((item, index) => {
          let eachIndex = operate_able[index];
          if ([1, 2, 3, 4, 5, 6, 9, 10].includes(eachIndex)) {
            let name = ['编辑', '审核', '删除', '恢复', '撤销', '批注', '', '', '提交', '彻底删除'][eachIndex - 1];
            let key = ['edit', 'audit_', 'delete', 'recover', 'revoke', 'comment', '', '', 'publish', 'delFinal'][
              eachIndex - 1
            ];
            this.operate_able.push({ name, key });
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
      switch (key) {
        case 'edit':
          this.$router.push(`/docs/series/edit/${this.series_id}`);
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
    async audit({ pass, comment }) {
      let data = {
        is_approved: pass,
        comment,
        status: this.operate_status
      };
      await this.$Model.Doc.post_audit(this.series_id, data);
      this.isAudit = false;
      window.DfsxWeb.freshComment(); // 刷新批注
      this.init(); // 刷新审核
    },
    async revoke() {
      // 撤销
      if (await this.$confirm('确定要撤销吗？')) {
        await this.$Model.Doc.revoke(this.series_id, {
          status: this.operate_status
        });
        this.init();
        this.$toast('撤销成功');
      }
    },
    async restore() {
      // 还原
      if (await this.$confirm('确定要恢复吗？')) {
        await this.$Model.Doc.restore([this.series_id]);
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    async del() {
      // 删除
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Doc.delete_series(this.series_id);
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    async delFinal() {
      // 彻底删除
      if (await this.$confirm('确定要彻底删除吗？')) {
        await this.$Model.Doc.delFinal(this.series_id);
        this.$navigation.cleanRoutes();
        this.$router.back();
      }
    },
    async comment(text) {
      // 批注
      await this.$Model.Doc.series_addComments(this.series_id, JSON.stringify(text));
      this.isComment = false;
      window.DfsxWeb.freshComment(); // 刷新批注
    },
    async commit() {
      // 提交
      if (await this.$confirm('确定要提交吗？')) {
        await this.$Model.Doc.commit(this.series_id);
        this.init();
        this.$toast('提交成功');
      }
    }
  }
};
</script>

<style lang="scss">
.page-sheet-detail {
  .s-footer {
    @each $img in edit, audit_, revoke, delete, comment, publish, delFinal, recover {
      span.s-#{$img} {
        background-image: url('./_images/#{$img}@2x.png');
      }
    }
  }
}
</style>
