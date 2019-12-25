<template>
  <div class="monitor--chartLine" v-if="indexes.length">
    <select v-model="selectName" @change="change(selectName)">
      <option v-for="item in indexes" :key="item.key" @change="change(item)">{{ item.name }}</option>
    </select>
    <section class="s-chartLine" ref="chartLine"></section>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  props: {
    content: { type: Object, default: {} }
  },
  data() {
    return {
      selectName: '',
      indexData: {},
      index_key: '',
      index_unit: '',
      VALUE_TYPE: {
        NUM: 0,
        ENUMS: 1
      }
    };
  },
  created() {
    if (this.indexes.length) {
      this.selectName = this.indexes[0].name;
      this.index_key = this.indexes[0].key;
      this.index_unit = this.indexes[0].unit_name;
      this.$nextTick(() => {
        this.initData();
      });
    }
  },
  computed: {
    indexes() {
      let { content, VALUE_TYPE } = this;
      let { indexes = [] } = content;
      if (content && content.index_key) {
        indexes = [{ name: content.type, key: content.index_key, unit_name: content.unit_name }];
      } else {
        indexes = indexes.filter(item => item.value_type == VALUE_TYPE.NUM); // 0-数字，1-枚举:枚举类型不显示折线图
      }
      return indexes;
    }
  },
  methods: {
    initData() {
      let { content, index_key } = this;
      // 优先显示报警开始、结束时间，若无则显示最近一个小时
      let stop = content.alarm_stop_time || Math.floor(Date.now() / 1000);
      let start = content.alarm_time || stop - 60 * 60 * 1;
      this.$Model.Monitor.data(content.type, content.id, index_key, { start, stop }).then(indexData => {
        this.initChartLine(indexData);
      });
    },
    change(name) {
      let target = this.indexes.find(item => item.name == name);
      this.index_key = target.key;
      this.index_unit = target.unit_name;
      this.initData();
    },
    initChartLine(indexData) {
      let dom = this.$refs.chartLine;
      let mycharts = echarts.init(dom);
      let { index_unit } = this;
      let formatter = `{value}${index_unit}`;
      // TODO：let max = 11;接口暂未提供报警阈值

      let xAxis_data_before = indexData.map(
        item =>
          (new Date(item.time * 1000).getHours() + '').padStart(2, '0') +
          ':' +
          (new Date(item.time * 1000).getMinutes() + '').padStart(2, '0')
      );
      let xAxis_data = Array.from(new Set(xAxis_data_before));
      let series_data = indexData.map(item => item.current_data).filter(item => item != null);
      let option = {
        grid: {
          top: '15%',
          left: '15%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis_data,
          axisLabel: {
            color: '#8b8b8b',
            formatter: `{value}`
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#8b8b8b',
            //margin: -0.5,
            formatter: formatter
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#e8e8e8'
            }
          }
        },
        series: [
          {
            name: '折线图',
            data: series_data,
            type: 'line',
            itemStyle: {
              normal: {
                color(params) {
                  return '#1f93ff';
                  /* if (params.value > max) {
                    return '#fb4c4c';
                  } else {
                    return '#1f93ff';
                  } */
                }
              }
            },
            lineStyle: {
              color: '#1f93ff',
              width: 1.2
            },
            /*   markLine: {
              silent: true,
              data: [{ yAxis: max }],
              lineStyle: {
                color: '#fb4c4c'
              }
            }, */
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: '#f6fbff'
                  },
                  {
                    offset: 0,
                    color: '#c9e5ff'
                  }
                ])
              }
            }
          }
        ]
      };
      mycharts.setOption(option);
    }
  }
};
</script>

<style lang="scss">
.monitor--chartLine {
  select {
    position: relative;
    border: 1px solid #e8e8e8;
    border-radius: 15px;
    padding: 2px 6px;
    background: #fafafa;
    margin: 0 15px;
  }
  section {
    width: 100%;
    height: 250px;
  }
}
</style>
