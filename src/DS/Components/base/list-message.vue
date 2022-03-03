<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">基本信息</h3>
    <div :class="[B('__list')]">
      <p :class="[B('__item')]" v-for="item in contents" :key="item.id" v-if="content">
        <label :class="[B('__item_key')]">{{ item.key }}</label>
        <span :class="[B('__item_value')]">{{ item.name }}</span>
      </p>

      <p :class="[B('__item')]" v-for="(item, index) in content.fields" :key="index">
        <label :class="[B('__item_key')]">{{ item.name }}:</label>
        <span :class="[B('__item_value')]">{{ item.value }}</span>
      </p>
      <p v-if="type == 'series'" :class="[B('__item')]">
        <label :class="[B('__item_key')]">提要:</label>
        <span :class="[B('__item_value')]" v-html="content.content"></span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
enum EDocMessageFieldType {
  '普通文本' = 0,
  '用户列表' = 1,
  '日期' = 2,
  '时间' = 3,
  '选项列表' = 4,
  '时长帧' = 5
}
enum ESubjectMessageFieldType {
  '普通文本' = 0,
  '用户列表' = 1,
  '日期' = 2
}
enum EClueMessageFieldType {
  '普通文本' = 1,
  '选择框' = 2,
  '日期' = 3
}
export default Vue.extend({
  name: 'base--list-message',
  props: {
    content: { type: Object, default: () => ({}) },
    isFresh: { type: Boolean, default: false },
    type: { type: String, default: '' }
  },
  data() {
    return {
      EDocMessageFieldType,
      ESubjectMessageFieldType,
      EClueMessageFieldType,
      contents: [] as any[]
    };
  },
  created() {
    this.init();
  },
  watch: {
    content() {
      this.init();
    },
    isFresh() {
      if (this.isFresh == true) {
        this.init();
      }
    }
  },
  methods: {
    statusName(status: number) {
      return ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过', '入库', '已发布', '发布失败'][status];
    },
    time(time: number) {
      let h = (((time / 60 / 60) | 0) + '').padStart(2, '0');
      let m = (((time / 60) % 60 | 0) + '').padStart(2, '0');
      let s = ((time % 60) + '').padStart(2, '0');
      return h + ':' + m + ':' + s;
    },
    dateFormat(timeStamp: number | string) {
      return this.$F.time(Number(timeStamp), 'yyyy-MM-dd hh:mm');
    },
    async init() {
      let { content, type } = this;
      let { fields, creation_time } = content;
      let creationTime = this.$F.time(creation_time || content.creationTime, 'yyyy-MM-dd hh:mm');
      switch (type) {
        case 'series':
          this.contents = [
            { key: '标题', name: content.title },
            { key: '栏目', name: content.col_name },
            { key: '创建人', name: content.creator_nickname || content.creator_username }
          ];
          fields?.map((item: any) => {
            if (item.type == EDocMessageFieldType.用户列表) {
              item.value = item.items?.map((item: any) => item.name).toString();
            } else if (item.type == EDocMessageFieldType.日期) {
              item.value = this.dateFormat(item.content);
            } else if (item.type == EDocMessageFieldType.时间) {
              item.value = this.time(Number(item.content || 0));
            } else if (item.type == EDocMessageFieldType.时长帧) {
              item.value = this.time(Number(item.content || 0) / 25);
            } else {
              item.value = item.content;
            }
            return item;
          });
          break;

        case 'doc':
          this.contents = [
            { key: '栏目', name: content.col_name },
            { key: '密级', name: ['公开', '内部', '秘密', '机密'][content.privacy - 1] }
          ];
          let { select = [] } = (await this.$Model.Doc.fieldsCustom('docs')) || {};
          select = select.map((item: any) => {
            let field = fields.find((field: any) => item.id && item.id == field.id);
            if (field) {
              item.content = field.content;
            } else if (item.is_system) {
              item.content =
                item.code == 'playType'
                  ? this.content['play_type_name']
                  : this.content[this.$F.humpUnderlineFormat(item.code, 'underline')];
            }
            return item;
          });
          this.content.fields = select.map((item: any) => {
            if (item.type == EDocMessageFieldType.日期) {
              item.value = this.dateFormat(item.content);
            } else if (item.type == EDocMessageFieldType.时间) {
              item.value = this.time(Number(item.content || 0));
            } else if (item.type == EDocMessageFieldType.时长帧) {
              item.value = this.time(Number(item.content || 0) / 25);
            } else {
              item.value = item.content;
            }
            return item;
          });

          break;

        case 'clue':
          this.contents = [
            { key: '栏目', name: content.column_name },
            { key: '关键词', name: content.key_words },
            { key: '密级', name: ['公开', '内部', '秘密', '机密'][content.privacy - 1] }
          ];
          fields.map((item: any) => {
            if (item.input_type == EClueMessageFieldType.选择框) {
              item.value = item.multiple ? item.value?.map((item: any) => item.nick).toString() : item.value?.nick;
            } else if (item.input_type == EClueMessageFieldType.日期) {
              item.value = this.$F.time(Number(item.value), 'yyyy-MM-dd hh:mm');
            }
            return item;
          });
          break;

        case 'weixin':
          let status = this.statusName(content.status);
          this.contents = [
            { key: '公众号', name: content.accountName },
            { key: '创建人', name: content.creatorNickname || content.creatorUsername },
            { key: '创建时间', name: creationTime },
            { key: '状态', name: status }
          ];
          break;

        case 'weibo':
          let reporter = content.reporters?.map((item: any) => item.nickname || item.username).toString();
          let editor = content.editors?.map((item: any) => item.nickname || item.username).toString();
          this.contents = [
            { key: '标题', name: content.title },
            { key: '栏目', name: content.account?.account_name },
            { key: '记者', name: reporter },
            { key: '编辑', name: editor },
            { key: '状态', name: content.audit_node_state }
          ];
          break;

        case 'subject':
          let targets;
          if (content.targets) {
            targets = content.targets.map((item: any) => item.name).toString();
          }
          this.contents = [
            { key: '拟报栏目', name: content.col_name },
            { key: '新闻类别', name: content.category_name },
            { key: '采访地址', name: content.geo_address },
            { key: '选题来源', name: content.source_name },
            { key: '发布渠道', name: targets }
          ];
          fields?.map((item: any) => {
            if (item.type == ESubjectMessageFieldType.用户列表) {
              item.value = item.items?.map((item: any) => item.name).toString();
            } else if (item.type == ESubjectMessageFieldType.日期) {
              item.value = this.dateFormat(item.content);
            } else {
              item.value = item.content;
            }
            return item;
          });
          break;

        case 'task':
          let users;
          if (content.users) {
            users = content.users.map((item: any) => item.nickname).toString();
          }
          this.contents = [
            { key: '标题', name: content.name },
            { key: '创建人', name: content.creator_nickname },
            { key: '参与人', name: users },
            { key: '创建时间', name: creationTime },
            { key: '任务类型', name: content.type_name },
            { key: '状态', name: ['待接受', '执行中', '执行中', '已完成', '已终止'][content.status - 1] }
          ];
          break;

        default:
          break;
      }
    }
  }
});
</script>

<style lang="scss">
.base--list-message {
  background-color: #fff;
  font-size: 14px;
  padding: 0 15px;
  border-bottom: 10px solid #f4f6f9;
  &__title {
    padding: 15px 0;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  &__item {
    margin: 20px 0;
    &_key {
      float: left;
      color: #999;
    }
    &_value {
      display: block;
      min-height: 19px;
      color: #333;
      margin-left: 84px;
      word-break: break-word;
    }
  }
}
</style>
