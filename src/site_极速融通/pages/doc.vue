<template>
  <div class="page-doc-detail page-detail">
    <h-topbar :title="content.title"></h-topbar>
    <div class="page-detail-main" :style="{'bottom':operate_able.length ? '70px' : '0'}">
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{content.title}}</p>
              <footer>
                <span>创建者: {{content.creator_nickname || content.creator_username}}</span>
                <time>创建时间: {{content.creation_time | ds_time}}</time>
              </footer>
            </div>
            <mark v-if="content.status">{{content.status | filter_status}}</mark>
          </div>
          <h-parse-body :content="content"></h-parse-body>
        </div>
        <div ref="message">
          <list-message :content="content" type="doc" v-if="content"></list-message>
        </div>
        <div ref="attachments">
          <list-attachments :mediumId="docId" type="doc"></list-attachments>
        </div>
        <div ref="comments">
          <list-comments :mediumId="docId" type="doc"></list-comments>
        </div>
        <div ref="records">
          <list-operlog :mediumId="docId" type="doc"></list-operlog>
        </div>
        <div ref="histories">
          <list-edition :mediumId="docId" type="doc"></list-edition>
        </div>
      </h-tab>
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
      docId: undefined,
      operate_able: []
    };
  },
  created() {
    let { params } = this.$route;
    let { doc_id } = params;
    this.docId = doc_id;
    this.$Model.Doc.doc(doc_id).then(data => {
      this.content = data;
    });
    this.tabKey = this.navItems[0].key || '';
  },
  filters: {
    filter_status(status) {
      return ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过'][status];
    }
  },
  methods: {
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
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