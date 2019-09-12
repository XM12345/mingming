<template>
  <div class="page-task page-detail">
    <h-topbar :title="content.name"></h-topbar>
    <div class="page-detail-main" :style="{'bottom':operate_able.length ? '70px' : '0'}">
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>{{content.name}}</p>
              <footer>
                <span>负责人: {{content.leader_nickname}}</span>
                <time>截止时间: {{content.expire_time | ds_time('yyyy-MM-dd hh:mm')}}</time>
              </footer>
            </div>
            <!-- 1-未接受，2-已接受，3-执行中，4-已完成，5-已终止 -->
            <mark v-if="content.status_name">{{content.status_name}}</mark>
          </div>
          <h-parse-body :content="content"></h-parse-body>
        </div>
        <div ref="message">
          <list-message :content="content" :isFresh="isFresh" type="task" v-if="content"></list-message>
        </div>
        <div ref="subject">
          <task--list-subject :subject="content.subject"></task--list-subject>
        </div>
        <div ref="comments">
          <list-comments :mediumId="task_id" type="task"></list-comments>
        </div>
      </h-tab>
    </div>
    <!-- <footer class="s-footer" v-if="operate_able.length">
      <span
        :class="`s-${item.key}`"
        v-for="item in operate_able"
        :key="item.key"
        @click="handle(item.key)"
      >{{item.name}}</span>
    </footer>-->
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
        { name: '批注', key: 'comments' }
      ],
      tabKey: '',
      operate_able: [],
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
    fresh() {
      this.$Model.Subject.task(this.task_id).then(data => {
        this.content.status_name = data.status_name;
        this.isFresh = true;
      });
    },
    onSwitch(key) {
      this.tabKey = key;
      this.$nextTick(() => {
        this.$refs[key].scrollIntoView();
      });
    },
    handle(key) {
      if (key == 'accept') {
        this.accept();
      }
    },
    accept() {
      // 接受任务
      this.$Model.Subject.accept(this.task_id).then(data => {
        this.init();
        this.$toast('接受成功');
      });
    }
  }
};
</script>

<style lang="scss">
.page-task {
  .s-footer {
    @each $img in accept {
      span.s-#{$img} {
        background-image: url('../images/detail/#{$img}@2x.png');
      }
    }
  }
}
</style>
