<template>
  <div :class="[B()]">
    <div v-for="item in indexes" :key="item.id" :class="[B('__item')]">
      <h-link :class="{ unnormal: item.is_alarming }" to="" @click.native="go(item)">
        <span v-if="item.value_type === VALUE_TYPE.ENUMS">{{ item.detail || '—' }}</span>
        <span v-else>{{ dataName(item) }}</span>
      </h-link>
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'monitor--device-ib',
  props: {
    content: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      VALUE_TYPE: {
        NUM: 0,
        ENUMS: 1
      }
    };
  },
  computed: {
    indexes(): any {
      let { content, VALUE_TYPE } = this;
      let { type, indexes = [] } = content;
      // 探测器顶部展示数字类型，枚举类型展示折线图在下方
      if (type === 'detector') {
        indexes = indexes.filter((item: any) => item.value_type === VALUE_TYPE.NUM); // 0-数字，1-枚举
      }
      if (type === 'tv-signal') {
        let abnormal = indexes.filter((item: any) => item.is_alarming === true) || [];
        // 若全为正常，则只显示一个指标正常，若有异常，则只显示异常的指标
        if (abnormal.length) {
          indexes = abnormal;
        } else {
          indexes = indexes.length ? indexes.slice(0, 1) : [];
        }
      }
      // 枚举类型筛选枚举描述value
      indexes.map((item: any) => {
        let { value_type, current_data, unit_name } = item;
        if (value_type == VALUE_TYPE.ENUMS) {
          this.$Model.Monitor.enums(type, item.key).then(enums => {
            item.detail = (enums.find((i: any) => i.value === current_data) || {}).name;
          });
        }
        return item;
      });
      return indexes;
    }
  },
  methods: {
    dataName(item: any) {
      return item.current_data != null ? item.current_data.toFixed(2) + item.unit_name : '—';
    },
    go(item: any) {
      if (item.is_alarming) {
        this.$router.push(`/monitor/alarms/${item.alarm_id}`);
      } else {
        return false;
      }
    }
  }
});
</script>

<style lang="scss">
@use 'sass:math';
.monitor--device-ib {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
  padding: 15px 0;
  &__item {
    width: math.div(100%, 3);
    a {
      font-size: 17px;
      color: #26c644;
      &.unnormal {
        position: relative;
        color: #fb4c4c;
        &::before {
          content: '!';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 15px;
          background: #fb4c4c;
          border-radius: 50%;
          color: #fff;
          font-size: 12px;
        }
      }
    }
    p {
      font-size: 13px;
      color: #333;
      margin: 6px 0;
    }
  }
}
</style>
