<template>
  <div :class="[B()]">
    <h-topbar :title="content.name"></h-topbar>
    <div :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="content" :class="[B('__content')]">
          <div :class="[B('__intro')]">
            <div :class="[B('__intro_message')]">
              <p :class="[B('__intro_title')]">{{ content.name }}</p>
              <div :class="[B('__intro_user')]">
                <span>负责人: {{ content.leader_nickname }}</span>
                <time>截止时间: {{ $F.time(content.expire_time, 'yyyy-MM-dd hh:mm') }}</time>
              </div>
            </div>
            <mark v-if="content.status_name" :class="[B('__intro_state')]">{{ content.status_name }}</mark>
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
          <base--list-comments :mediumId="taskId" type="task"></base--list-comments>
        </div>
        <div ref="records">
          <task--list-records :taskId="taskId"></task--list-records>
        </div>
      </h-tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-subject-task-content',
  data() {
    return {
      content: {} as any,
      navItems: [
        { name: '任务内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '关联选题', key: 'subject' },
        { name: '批注', key: 'comments' },
        { name: '任务进度', key: 'records' }
      ],
      tabKey: '',
      taskId: 0,
      isFresh: false
    };
  },
  created() {
    let { params } = this.$route;
    let { task_id } = params;
    this.taskId = Number(task_id) || 0;
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshState = this.fresh;
    }
  },
  methods: {
    async init() {
      let content = await this.$Model.Subject.task(this.taskId);
      if (content) {
        this.content = content;
        this.$title(content.name);
      }
    },
    fresh() {
      this.init();
      this.isFresh = true;
      window.DfsxWeb?.freshLogs?.();
    },
    onSwitch(key: string) {
      this.tabKey = key;
      this.$nextTick(() => {
        (this.$refs[key] as any).scrollIntoView();
      });
    }
  }
});
</script>

<style lang="scss">
.page-subject-task-content {
  &__content {
    border-bottom: 10px solid #f4f6f9;
  }

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
      img {
        width: 30px;
        height: 15px;
        padding: 0 2px;
        object-fit: contain !important;
      }
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
