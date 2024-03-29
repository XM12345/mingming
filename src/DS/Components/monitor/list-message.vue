<template>
  <div :class="[B()]">
    <h2 :class="[B('__title')]">基本信息</h2>
    <div :class="[B('__main')]">
      <p
        v-for="(item, index) in contents"
        :key="item.key"
        :class="[B('__item'), index === contents.length - 1 && index % 2 === 0 && 'max']"
      >
        <label :class="[B('__item_key')]">{{ item.key }}:</label>
        <span v-if="item.type === 'grade'" :class="[B('__item_value')]">
          <i v-for="i in item.value" :key="i">&#9733;</i>
        </span>
        <span v-else-if="item.type === 'size'" :class="[B('__item_value')]">{{ $F.size(item.value) }}</span>
        <span v-else :class="[B('__item_value')]">{{ item.value }}</span>
        <mark v-if="item.is_alarming" @click="toAlarms(item.alarm_id)">!</mark>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'monitor--list-message',
  props: {
    type: { type: String, default: '' },
    content: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      contents: [] as { key: string; value: string; type?: string; is_alarming?: boolean; alarm_id?: number }[],
      VALUE_TYPE: {
        NUM: 0,
        ENUMS: 1
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let { type, content, VALUE_TYPE } = this;
      let { extension, indexes = [] } = content;
      let managers = (content.managers || []).map((item: any) => item.nickname || item.username).toString();
      switch (type) {
        case 'signal':
          this.contents = [
            { key: '频道', value: content.channel_name },
            { key: '信号类型', value: content.type_name || content.type },
            { key: '运维等级', type: 'grade', value: content.level },
            { key: '负责人', value: managers }
          ];
          break;

        case 'device':
          let contents = [
            { key: '品牌', value: content.brand },
            { key: '型号', value: content.product_model },
            { key: '运维等级', type: 'grade', value: content.level },
            { key: '资源组', value: content.resource_group_name },
            { key: '所在机房', value: content.machine_room_name },
            { key: '负责人', value: managers }
          ];
          if (extension && content.type !== 'ib') {
            if (content.type === 'server') {
              contents.push({ key: '操作系统', value: extension.operation_system });
            }
            contents.push(
              { key: '机器', value: extension.machine_name },
              { key: 'IP地址', value: extension.ip_address },
              { key: '空间', type: 'size', value: extension.storage_size }
            );
          }
          this.contents = contents;
          break;

        case 'room':
          this.contents = [
            { key: '品牌', value: content.brand },
            { key: '型号', value: content.product_model },
            { key: '运维等级', type: 'grade', value: content.level },
            { key: '所在机房', value: content.machine_name },
            { key: '负责人', value: managers }
          ];
          break;

        case 'app':
          this.contents = [
            { key: '应用类型', value: content.type_name },
            { key: '版本', value: content.version },
            { key: '品牌', value: content.brand },
            { key: '型号', value: content.product_model },
            { key: '资源组', value: content.resource_group_name },
            { key: '运维等级', type: 'grade', value: content.level },
            { key: '所在机房', value: content.machine_room_name },
            { key: '关联设备', value: content.device_name },
            { key: '负责人', value: managers }
          ];
          break;

        case 'app-control':
        case 'ups':
        case 'detector':
          if (type === 'app-control') {
            indexes = indexes.filter((item: any) => item.unit_name !== '%');
          }

          if (type === 'detector') {
            indexes = indexes.filter((item: any) => item.value_type === VALUE_TYPE.ENUMS);
          }

          indexes.forEach((item: any) => {
            let { value_type, current_data, unit_name } = item;
            let value;
            if (value_type == VALUE_TYPE.ENUMS) {
              this.$Model.Monitor.enums(content.type, item.key).then(enums => {
                value = (enums.find((i: any) => i.value === current_data) || {}).name || '—';
                this.contents.push({
                  key: item.name,
                  value: value,
                  is_alarming: item.is_alarming,
                  alarm_id: item.alarm_id
                });
              });
            } else {
              value = current_data != null ? (current_data || 0).toFixed(2) + unit_name : '';
              this.contents.push({
                key: item.name,
                value: value,
                is_alarming: item.is_alarming,
                alarm_id: item.alarm_id
              });
            }
          });
          break;

        default:
          break;
      }
    },
    toAlarms(id: number) {
      this.$router.push(`/monitor/alarms/${id}`);
    }
  }
});
</script>

<style lang="scss">
.monitor--list-message {
  font-size: 14px;
  color: #333;
  padding: 10px 15px;
  border-bottom: 10px solid #f4f6f9;
  &__title {
    font-weight: 400;
    font-size: 14px;
    color: #999;
  }

  &__main {
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    width: 50%;
    margin: 5px 0;

    &.max {
      width: 100%;
    }
    span {
      color: #8b8b8b;
      padding-left: 5px;
      word-break: break-all;
    }
    i {
      font-style: normal;
    }
    mark {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-left: 5px;
      background: #fb4c4c;
      border-radius: 50%;
      color: #fff;
      font-size: 12px;
      text-align: center;
      vertical-align: text-bottom;
    }
  }
}
</style>
