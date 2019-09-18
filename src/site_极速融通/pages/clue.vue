<template>
  <div class="page-clue-detail page-detail">
    <h-topbar :title="content.title"></h-topbar>
    <div
      class="page-clue-detail-main page-detail-main"
      :style="{'bottom':operate_able.length ? '70px' : '0'}"
    >
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>
                {{content.title}}
                <img
                  :src="item.icon_url"
                  :alt="item.name"
                  v-for="item in content.signs"
                  :key="item.id"
                />
              </p>
              <footer>
                <span>创建者: {{content.creator_nick_name || content.creator_user_name}}</span>
                <time>创建时间: {{content.creation_time | ds_time}}</time>
              </footer>
            </div>
            <!-- 0、未提交，1、已提交，2、已发布，3、已回收 -->
            <mark v-if="content.state">{{content.state | filter_state}}</mark>
          </div>
          <h-parse-body :content="content"></h-parse-body>
        </div>

        <div ref="message">
          <list-message :content="content" type="clue" v-if="content"></list-message>
        </div>
        <div ref="attachments">
          <list-attachments
            :mediumId="clueId"
            :content="content.mobjects"
            type="clue"
            v-if="content.mobjects"
          ></list-attachments>
        </div>
        <div ref="comments">
          <list-comments :mediumId="clueId" type="clue"></list-comments>
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
        { name: '稿件内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '批注', key: 'comments' }
      ],
      content: '',
      clueId: undefined,
      operate_able: []
    };
  },
  created() {
    this.init();
  },
  filters: {
    filter_state(state) {
      return ['未提交', '已提交', '已发布', '已回收'][state];
    }
  },
  methods: {
    init() {
      let { params, query } = this.$route;
      let { clue_id } = params;
      let { type } = query;
      this.clueId = clue_id;
      let Model;
      if (type == 'common') {
        Model = this.$Model.Clue.common(clue_id);
      } else if (type == 'recyclebin') {
        Model = this.$Model.Clue.recyclebin(clue_id);
      } else {
        Model = this.$Model.Clue.clue(clue_id);
      }
      Model.then(data => {
        this.content = data;
        this.$title(data.title);
      });
      this.tabKey = this.navItems[0].key || '';
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
