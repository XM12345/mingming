<template>
  <div class="page-clue-detail page-detail">
    <base--topbar :title="content.title"></base--topbar>
    <div class="page-clue-detail-main page-detail-main">
      <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <div ref="content" class="main-content">
          <div class="s-intro">
            <div class="s-intro-mes">
              <p>
                {{ content.title }}
                <img :src="item.icon_url" :alt="item.name" v-for="item in content.signs" :key="item.id" />
              </p>
              <footer>
                <span>创建者: {{ content.creator_nick_name || content.creator_user_name }}</span>
                <time>创建时间: {{ content.creation_time | ds_time('yyyy-MM-dd hh:mm') }}</time>
              </footer>
            </div>
            <!-- 0、未提交，1、已提交，2、已发布，3、已回收 -->
            <mark>{{ content.state | filter_state }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
        </div>

        <div ref="message">
          <base--list-message :content="content" type="clue" v-if="content"></base--list-message>
        </div>
        <div ref="attachments">
          <base--list-attachments
            :mediumId="clueId"
            :content="content.mobjects"
            type="clue"
            :columnId="content.column_id"
            v-if="content.mobjects"
          ></base--list-attachments>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="clueId" type="clue"></base--list-comments>
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
        { name: '稿件内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '批注', key: 'comments' }
      ],
      content: '',
      clueId: undefined,
      type: ''
    };
  },
  created() {
    let { params, query } = this.$route;
    let { clue_id } = params;
    let { type } = query;
    this.clueId = clue_id;
    this.type = type;
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  filters: {
    filter_state(state) {
      return ['未提交', '已提交', '已发布', '已回收'][state];
    }
  },
  mounted() {
    // app 刷新状态
    window.DfsxWeb.freshState = this.fresh;
  },
  methods: {
    getModel() {
      let Model;
      if (this.type == 'common') {
        Model = this.$Model.Clue.common(this.clueId);
      } else if (this.type == 'recyclebin') {
        Model = this.$Model.Clue.recyclebin(this.clueId);
      } else {
        Model = this.$Model.Clue.clue(this.clueId);
      }
      return Model;
    },
    init() {
      this.getModel().then(data => {
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
      this.getModel().then(data => {
        this.content.state = data.state;
      });
    }
  }
};
</script>
