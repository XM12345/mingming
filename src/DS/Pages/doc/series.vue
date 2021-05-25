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
                <time>创建时间: {{ content.creation_time | ds_time('yyyy-MM-dd hh:mm') }}</time>
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
          this.$router.push(`/series/edit/${this.series_id}`);
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
        // 刷新批注
        window.DfsxWeb.freshComment();
        this.init(); // 刷新审核
      });
    },
    revoke() {
      // 撤销
      let data = {
        status: this.operate_status
      };
      this.$messagebox.confirm('确定要撤销吗？').then(action => {
        this.$Model.Doc.revoke(this.series_id, data).then(() => {
          this.init();
          this.$toast('撤销成功');
        });
      });
    },
    restore() {
      // 还原
      let ids = [this.series_id];
      this.$messagebox.confirm('确定要恢复吗？').then(action => {
        this.$Model.Doc.restore(ids).then(() => {
          this.$navigation.cleanRoutes();
          this.$router.back();
        });
      });
    },
    del() {
      // 删除
      this.$messagebox.confirm('确定要删除吗？').then(action => {
        this.$Model.Doc.delete_series(this.series_id).then(() => {
          this.$navigation.cleanRoutes();
          this.$router.back();
        });
      });
    },
    delFinal() {
      // 彻底删除
      this.$messagebox.confirm('确定要彻底删除吗？').then(action => {
        this.$Model.Doc.delFinal(this.series_id).then(() => {
          this.$navigation.cleanRoutes();
          this.$router.back();
        });
      });
    },
    comments() {
      // 批注post
      if (this.text != '') {
        this.$Model.Doc.series_addComments(this.series_id, JSON.stringify(this.text)).then(data => {
          this.isComment = false;
          // 刷新批注
          window.DfsxWeb.freshComment();
          this.text = '';
        });
      } else {
        this.$toast('批注不能为空');
      }
    },
    commit() {
      // 提交
      this.$messagebox.confirm('确定要提交吗？').then(action => {
        this.$Model.Doc.commit(this.series_id).then(() => {
          this.init();
          this.$toast('提交成功');
        });
      });
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
