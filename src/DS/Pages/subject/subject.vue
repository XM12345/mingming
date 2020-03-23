<template>
  <div class="page-subject-detail page-detail">
    <base--topbar :title="content.title"></base--topbar>
    <div class="page-subject-detail-main page-detail-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{ content.title }}</p>
              <footer>
                <span>创建者: {{ content.creator_nickname || content.creator_username }}</span>
                <time>创建时间: {{ content.creation_time | ds_time }}</time>
              </footer>
            </div>
            <mark v-if="content.status_name">{{ content.status_name }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
        </div>
        <div ref="message">
          <base--list-message :content="content" type="subject" v-if="content"></base--list-message>
        </div>
        <div ref="attachments">
          <base--list-attachments :mediumId="subjectId" type="subject"></base--list-attachments>
        </div>
        <div ref="tasks">
          <subject--list-tasks :mediumId="subjectId" type="tasks"></subject--list-tasks>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="subjectId" type="subject"></base--list-comments>
        </div>
        <div ref="operlog">
          <base--list-operlog :mediumId="subjectId" type="subject"></base--list-operlog>
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
        { name: '选题内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '任务', key: 'tasks' },
        { name: '批注', key: 'comments' },
        { name: '操作纪录', key: 'operlog' }
      ],
      content: '',
      subjectId: undefined
    };
  },
  created() {
    let { params } = this.$route;
    let { subject_id } = params;
    this.subjectId = subject_id;
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  mounted() {
    // app 刷新状态
    window.DfsxWeb.freshState = this.fresh;
  },
  methods: {
    init() {
      this.$Model.Subject.subject(this.subjectId).then(data => {
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
      this.$Model.Subject.subject(this.subjectId).then(data => {
        this.content.status_name = data.status_name;
      });
    }
  }
};
</script>
