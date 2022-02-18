<template>
  <div :class="[B()]">
    <h-topbar :title="content.title"></h-topbar>
    <div :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="content" :class="[B('__content')]">
          <div :class="[B('__intro')]">
            <div :class="[B('__intro_message')]">
              <p :class="[B('__intro_title')]">
                {{ content.title }}
                <img :src="item.icon_url" :alt="item.name" v-for="item in content.signs" :key="item.id" />
              </p>
              <div :class="[B('__intro_user')]">
                <span>创建者: {{ content.creator_nick_name || content.creator_user_name }}</span>
                <time>创建时间: {{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
              </div>
            </div>
            <mark :class="[B('__intro_state')]">{{ stateName(content.state) }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
        </div>

        <div ref="message">
          <base--list-message v-if="content" :content="content" type="clue"></base--list-message>
        </div>
        <div ref="attachments">
          <base--list-attachments
            v-if="content.mobjects"
            :mediumId="clueId"
            :content="content.mobjects"
            type="clue"
            :columnId="content.column_id"
          ></base--list-attachments>
        </div>
        <div ref="comments">
          <base--list-comments :mediumId="clueId" type="clue"></base--list-comments>
        </div>
      </h-tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-clue-content',
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '稿件内容', key: 'content' },
        { name: '基本信息', key: 'message' },
        { name: '附件', key: 'attachments' },
        { name: '批注', key: 'comments' }
      ],
      content: {} as any,
      clueId: 0,
      type: ''
    };
  },
  created() {
    let { clue_id } = this.$route.params;
    let { type } = this.$route.query;
    this.clueId = Number(clue_id) || 0;
    this.type = String(type || '');
    this.tabKey = this.navItems[0].key || '';
    this.init();
  },
  mounted() {
    // app 刷新状态
    if (window.DfsxWeb) {
      window.DfsxWeb.freshState = this.freshState;
    }
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
    async init() {
      let content = await this.getModel();
      if (content) {
        this.content = content;
        this.$title(content.title);
      }
    },
    stateName(state: number) {
      // 0、未提交，1、已提交，2、已发布，3、已回收
      return ['未提交', '已提交', '已发布', '已回收'][state];
    },
    onSwitch(key: string) {
      this.tabKey = key;
      this.$nextTick(() => {
        (this.$refs[key] as any).scrollIntoView();
      });
    },
    async freshState() {
      let content = await this.getModel();
      if (content) {
        this.content.state = content.state;
      }
    }
  }
});
</script>

<style lang="scss">
.page-clue-content {
  background: #f4f6f9;

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
