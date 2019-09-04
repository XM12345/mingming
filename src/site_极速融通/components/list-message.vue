<template>
  <div class="page-cms--list-message">
    <h3 class="s-title">基本信息</h3>
    <div class="s-column">
      <p class="s-column-line" v-for="item in contents" :key="item.id" v-if="content">
        <label class="s-column-line-key">{{item.key}}</label>
        <span class="s-column-line-value">{{item.name}}</span>
      </p>

      <p class="s-column-line" v-for="item in content.fields" :key="item.id">
        <!--clue input_type:1、文本框输入（字符串）；2、选择框（单选为下拉框）；3、时间类型 -->
        <!-- doc,subject,series: type:0-普通文本，1-用户，2-日期 -->
        <label class="s-column-line-key">{{item.name}}:</label>
        <span class="s-column-line-value">{{item.value}}</span>
      </p>
      <p v-if="type=='series'">
        <label class="s-column-line-key">提要:</label>
        <span class="s-column-line-value" v-html="content.content"></span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      contents: []
    };
  },
  created() {
    this.init();
  },
  filters: {
    filter_status(status) {
      return (
        ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过', '入库', '已发布', '发布失败'][status] ||
        '未知'
      );
    }
  },
  watch: {
    content() {
      this.init();
    }
  },
  methods: {
    init() {
      let { content, type } = this;
      let { fields } = content;
      if (fields && (type == 'series' || type == 'doc' || type == 'subject')) {
        fields.map(item => {
          if (item.type == 0) {
            item.value = item.content;
          } else if (item.type == 1) {
            item.value = item.items.map(item => item.name).toString();
          } else if (item.type == 2) {
            item.value = this.constructor.filter('ds_time')(parseInt(item.content), 'yyyy-MM-dd hh:mm');
          }
          return item;
        });
      }
      if (type == 'series') {
        this.contents = [
          { key: '标题', name: content.title },
          { key: '栏目', name: content.col_name },
          { key: '编辑', name: content.editor_nickname || content.editor_username }
        ];
      } else if (type == 'doc') {
        this.contents = [{ key: '栏目', name: content.col_name }];
      } else if (type == 'clue') {
        this.contents = [{ key: '栏目', name: content.column_name }];
        fields.map(item => {
          if (item.input_type == 2 && item.multiple == false) {
            item.value = item.value.nick;
          } else if (item.input_type == 2 && item.multiple == true) {
            if (item.value) {
              item.value = item.value.map(item => item.nick).toString();
            }
          } else if (item.input_type == 3) {
            item.value = this.constructor.filter('ds_time')(parseInt(item.value), 'yyyy-MM-dd hh:mm');
          }

          return item;
        });
      } else if (type == 'weixin') {
        let creationTime = this.constructor.filter('ds_time')(content.creationTime, 'yyyy-MM-dd hh:mm');
        let status = this.constructor.filter('filter_status')(content.status);
        this.contents = [
          { key: '公众号', name: content.accountName },
          { key: '创建人', name: content.creatorNickname || content.creatorUsername },
          { key: '创建时间', name: creationTime },
          { key: '状态', name: status }
        ];
      } else if (type == 'weibo') {
        let reporter = content.reporters.map(item => item.nickname || item.username).toString();
        let editor = content.editors.map(item => item.nickname || item.username).toString();
        this.contents = [
          { key: '标题', name: content.title },
          { key: '栏目', name: content.account.account_name },
          { key: '记者', name: reporter },
          { key: '编辑', name: editor },
          { key: '状态', name: content.audit_node_state }
        ];
      } else if (type == 'subject') {
        let targets = content.targets.map(item => item.name).toString();
        this.contents = [
          { key: '拟报栏目', name: content.col_name },
          { key: '新闻类别', name: content.category_name },
          { key: '采访地址', name: content.geo_address },
          { key: '选题来源', name: content.source_name },
          { key: '发布渠道', name: targets }
        ];
      } else if (type == 'task') {
        let creationTime = this.constructor.filter('ds_time')(content.creation_time, 'yyyy-MM-dd hh:mm');
        let users = content.users.map(item => item.nickname).toString();
        this.contents = [
          { key: '标题', name: content.name },
          { key: '创建人', name: content.creator_nickname },
          { key: '参与人', name: users },
          { key: '创建时间', name: creationTime },
          { key: '任务类型', name: content.type_name },
          { key: '状态', name: content.status_name }
        ];
      }
    }
  }
};
</script>

<style lang="scss">
.page-cms--list-message {
  background-color: #fff;
  font-size: 14px;
  padding: 0 15px;
  border-bottom: 10px solid #f4f6f9;
  h3.s-title {
    padding: 15px 0;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  .s-column {
    &-line {
      margin: 20px 0;
      &-key {
        float: left;
        color: #999;
      }
      &-value {
        display: block;
        min-height: 19px;
        color: #333;
        margin-left: 84px;
        word-break: break-word;
      }
    }
  }
}
</style>
