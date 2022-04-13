<template>
  <div v-show="indexes.length" :class="[B()]">
    <div v-for="item in indexes" :key="item.id" :class="[B('__item')]">
      <svg viewBox="0,0,100,100">
        <circle cx="50" cy="50" r="50" stroke-width="19" stroke="#eaeaea" fill="none"></circle>
        <text
          x="50"
          y="50"
          font-size="20"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="levelColor(item.level)"
        >
          {{ item.current_data + item.unit_name }}
        </text>
        <circle
          cx="50"
          cy="50"
          r="50"
          stroke-width="19"
          :stroke="levelColor(item.level)"
          fill="none"
          :stroke-dasharray="dash(item)"
          transform="rotate(-90,50,50)"
        >
          <animate attributeName="stroke-dasharray" from="0 50" :to="dash(item)" dur="0.4s" />
        </circle>
      </svg>
      <div :class="[B('__item_title')]">{{ item.name }}</div>
      <mark v-if="item.is_alarming" :class="[B('__item_alarm')]" @click="toAlarms(item)">!</mark>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'monitor--circle',
  props: {
    content: { type: Object, default: () => ({}) }
  },
  computed: {
    indexes(): any {
      let { content } = this;
      let { indexes = [] } = content;
      indexes = indexes.filter((item: any) => item.unit_name === '%'); // 圆环图筛选指标单位为%
      return indexes;
    }
  },
  methods: {
    dash(item: any) {
      let lineLength = 2 * Math.PI * 50;
      let dash = lineLength * (item.current_data / 100) + ' ' + lineLength * (1 - item.current_data / 100);
      return dash;
    },
    levelColor(level: number) {
      let colors = ['#26c644', '#ff802c', '#ff802c', '#fb4c4c', '#fb4c4c'];
      return colors[level];
    },
    toAlarms(item: any) {
      this.$router.push(`/monitor/alarms/${item.alarm_id}`);
    }
  }
});
</script>

<style lang="scss">
.monitor--circle {
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  &__item {
    position: relative;
    svg {
      position: relative;
      width: 16vw;
      height: 16vw;
      background: inherit;
      border-radius: 50%;
      circle {
        -webkit-transition: stroke-dasharray 0.5s;
        transition: stroke-dasharray 0.5s;
      }
    }
    &_title {
      text-align: center;
      font-size: 14px;
      color: #333;
      margin: 5px 0;
    }
    &_alarm {
      position: absolute;
      right: -20px;
      top: 0;
      width: 15px;
      height: 15px;
      background: #fb4c4c;
      border-radius: 50%;
      color: #fff;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
