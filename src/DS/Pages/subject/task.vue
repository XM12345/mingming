<template>
  <div class="page-task page-detail">
    <base--topbar :title="content.name"></base--topbar>
    <div class="page-detail-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{ content.name }}</p>
              <footer>
                <span>负责人: {{ content.leader_nickname }}</span>
                <time>截止时间: {{ $F.time(content.expire_time, 'yyyy-MM-dd hh:mm') }}</time>
              </footer>
            </div>
            <!-- 1-待接受，2-已接受（执行中），3-执行中，4-已完成，5-已终止 -->
            <mark v-if="content.status">{{ statusName(content.status) }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
        </div>
        <div ref="message">
          <base--list-message :content="content" :isFresh="isFresh" type="task" v-if="content"></base--list-message>
        </div>
        <div ref="subject">
          <task--list-subject :subject="content.subject"></task--list-subject>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="task_id" type="task"></base--list-comments>
        </div>
        <div ref="records">
          <task--list-records :taskId="task_id"></task--list-records>
        </div>
      </base--tab>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      operate_able: [],
      navItems: [
        { name: '任务内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '关联选题', key: 'subject' },
        { name: '批注', key: 'comments' },
        { name: '任务进度', key: 'records' }
      ],
      tabKey: '',
      task_id: undefined,
      isFresh: false
    };
  },
  created() {
    let { params } = this.$route;
    let { task_id } = params;
    this.task_id = task_id;
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  mounted() {
    // app 任务详情点击完成刷新任务状态
    window.DfsxWeb.freshState = this.fresh;
  },
  methods: {
    init() {
      this.$Model.Subject.task(this.task_id).then(data => {
        this.content = data;
        this.$title(data.name);
      });
    },
    statusName(status) {
      return ['待接受', '执行中', '执行中', '已完成', '已终止'][status - 1];
    },
    fresh() {
      this.$Model.Subject.task(this.task_id).then(data => {
        this.content.status = data.status;
        this.content.subject = data.subject;
        this.isFresh = true;
        window.DfsxWeb.freshLogs();
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
