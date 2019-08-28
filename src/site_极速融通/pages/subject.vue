<template>
  <div class="page-subject-detail page-detail">
    <h-topbar :title="content.title"></h-topbar>
    <div
      class="page-subject-detail-main page-detail-main"
      :style="{'bottom':operate_able.length ? '70px' : '0'}"
    >
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
            <mark v-if="content.status_name">{{content.status_name}}</mark>
          </div>
          <h-parse-body :content="content"></h-parse-body>
        </div>
        <div ref="message">
          <list-message :content="content" type="subject" v-if="content"></list-message>
        </div>
        <div ref="attachments">
          <list-attachments :mediumId="subjectId" type="subject"></list-attachments>
        </div>
        <div ref="tasks">
          <subject--list-tasks :mediumId="subjectId" type="tasks"></subject--list-tasks>
        </div>
        <div ref="comments">
          <list-comments :mediumId="subjectId" type="subject"></list-comments>
        </div>
        <div ref="operlog">
          <list-operlog :mediumId="subjectId" type="subject"></list-operlog>
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
        { name: '选题内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '任务', key: 'tasks' },
        { name: '批注', key: 'comments' },
        { name: '操作纪录', key: 'operlog' }
      ],
      content: '',
      subjectId: undefined,
      operate_able: []
    };
  },
  created() {
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  methods: {
    init() {
      let { params } = this.$route;
      let { subject_id } = params;
      this.subjectId = subject_id;
      this.$Model.Subject.subject(subject_id).then(data => {
        this.content = data;
      });
    },
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    }
  }
};
</script>