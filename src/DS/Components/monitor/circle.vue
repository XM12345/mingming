<template>
  <div class="monitor--circle" v-if="indexes.length">
    <div class="s-circle-item" v-for="item in indexes" :key="item.id">
      <svg viewBox="0,0,100,100">
        <circle cx="50" cy="50" r="50" stroke-width="19" stroke="#eaeaea" fill="none"></circle>
        <text
          x="50"
          y="50"
          font-size="20"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="item.level | filter_level"
        >
          {{ item.current_data + item.unit_name }}
        </text>
        <circle
          cx="50"
          cy="50"
          r="50"
          stroke-width="19"
          :stroke="item.level | filter_level"
          fill="none"
          :stroke-dasharray="item | filter_dash"
          transform="rotate(-90,50,50)"
        >
          <animate attributeName="stroke-dasharray" from="0 50" :to="item | filter_dash" dur="0.4s" />
        </circle>
      </svg>
      <div class="title">{{ item.name }}</div>
      <mark v-if="item.is_alarming" @click="toAlarms(item)">!</mark>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object
    }
  },
  filters: {
    filter_dash(item) {
      let lineLength = 2 * Math.PI * 50;
      let dash = lineLength * (item.current_data / 100) + ' ' + lineLength * (1 - item.current_data / 100);
      return dash;
    },
    filter_level(level) {
      let colors = ['#26c644', '#ff802c', '#ff802c', '#fb4c4c', '#fb4c4c'];
      return colors[level];
    }
  },
  computed: {
    indexes() {
      let { content } = this;
      let { indexes = [] } = content;
      indexes = indexes.filter(item => item.unit_name == '%');// 圆环图筛选指标单位为%
      return indexes;
    }
  },
  methods: {
    toAlarms(item) {
      this.$router.push(`/alarms/${item.alarm_id}`);
    }
  }
};
</script>

<style lang="scss">
.monitor--circle {
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .s-circle-item {
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
    .title {
      text-align: center;
      font-size: 14px;
      color: #333;
      margin: 5px 0;
    }
    mark {
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
