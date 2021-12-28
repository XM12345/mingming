<template>
  <div class="page-doc-detail page-detail">
    <base--topbar :title="content.title"></base--topbar>
    <div class="page-detail-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
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
          <base--parse-body :content="content"></base--parse-body>
        </div>
        <div ref="message">
          <base--list-message :content="content" type="doc" v-if="content"></base--list-message>
        </div>
        <div ref="attachments">
          <base--list-attachments :mediumId="docId" type="doc"></base--list-attachments>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="docId" type="doc"></base--list-comments>
        </div>
        <div ref="records">
          <base--list-operlog :mediumId="docId" type="doc"></base--list-operlog>
        </div>
        <div ref="histories">
          <doc--list-edition :mediumId="docId" type="doc"></doc--list-edition>
        </div>
      </base--tab>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '文稿内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '批注', key: 'comments' },
        { name: '操作纪录', key: 'records' },
        { name: '历史版本', key: 'histories' }
      ],
      content: '',
      docId: undefined
    };
  },
  created() {
    let { params } = this.$route;
    let { doc_id } = params;
    this.docId = doc_id;
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  mounted() {
    // app 刷新状态
    window.DfsxWeb.freshState = this.fresh;
  },
  methods: {
    init() {
      this.$Model.Doc.doc(this.docId).then(data => {
        this.content = data;
        this.$title(data.title);
      });
    },
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    },
    fresh() {
      this.$Model.Doc.doc(this.docId).then(data => {
        this.content.status = data.status;
      });
    },
    handle(key) {
      if (key == 'audit_') {
        this.audit();
      } else if (key == 'delete') {
        this.delete();
      } else if (key == 'revoke') {
        this.revoke();
      } else if (key == 'comment') {
        this.comments();
      }
    }
  }
};
</script>
