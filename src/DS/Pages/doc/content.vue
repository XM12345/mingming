<template>
  <div :class="[B()]">
    <h-topbar :title="content.title"></h-topbar>

    <div :class="[B('__main')]">
      <h-tab :columns="navItems" :activeIndex="tabKey" @switch="onSwitch">
        <div ref="content" :class="[B('__content')]">
          <div :class="[B('__intro')]">
            <div :class="[B('__intro_message')]">
              <p :class="[B('__intro_title')]">{{ content.title }}</p>
              <div :class="[B('__intro_user')]">
                <span>创建者: {{ content.creator_nickname || content.creator_username }}</span>
                <time>创建时间: {{ $F.time(content.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
              </div>
            </div>
            <mark v-if="content.status_name" :class="[B('__intro_state')]">{{ content.status_name }}</mark>
          </div>
          <base--parse-body :content="content"></base--parse-body>
        </div>
        <div ref="message">
          <base--list-message v-if="content.id" :content="content" type="doc"></base--list-message>
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
      </h-tab>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-doc-content',
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
      content: {} as any,
      docId: 0
    };
  },
  created() {
    let { doc_id } = this.$route.params;
    this.docId = Number(doc_id) || 0;
    this.init();
    this.tabKey = this.navItems[0].key || '';
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshState = this.init;
    }
  },
  methods: {
    init() {
      this.$Model.Doc.doc(this.docId).then(data => {
        this.content = data;
        this.$title(data.title);
      });
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
.page-doc-content {
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
