<template>
  <div :class="[B()]">
    <div :class="[B('__main')]">
      <div :class="[B('__stat')]">
        <h2><span>发布数据</span></h2>
        <div :class="[B('__stat_all')]">
          <p>{{ stat.total }}</p>
          <span>累计发布</span>
        </div>
        <div :class="[B('__stat_items')]">
          <div v-for="(item, index) in types" :key="index">
            <p>{{ item.name }}</p>
            <span>{{ item.count }}</span>
          </div>
        </div>
      </div>

      <div :class="[B('__types')]">
        <h2>
          <span>发布趋势</span> <mark><label>图文</label><label>视频</label></mark>
        </h2>
        <section ref="days" :class="[B('__types_days')]"></section>
      </div>

      <div :class="[B('__views')]">
        <h2><span>阅读排名TOP10</span></h2>
        <nav>
          <span>排名</span>
          <span>标题</span>
          <span>创建人</span>
        </nav>
        <ul>
          <li v-for="(item, index) in views" :key="item.id">
            <span :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span>{{ item.title }}</span>
            <span>{{ item.author_nickname || item.author_name }}</span>
          </li>
        </ul>
      </div>

      <div :class="[B('__columns')]">
        <h2><span>栏目发布TOP10</span></h2>
        <section ref="columns" :class="[B('__columns_chart')]"></section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import echarts from 'echarts';

type ICmsType = 'default' | 'video' | 'special' | 'vote' | 'banner' | 'questionnaire' | 'pictureset' | 'show';

let typesNames = {
  default: '图文',
  video: '视频',
  special: '专题',
  vote: '投票',
  banner: '横幅',
  questionnaire: '问卷',
  pictureset: '图组',
  show: '直播'
};

export default Vue.extend({
  name: 'page-cms-stat',
  data() {
    return {
      baviewToken: '',
      baviewApiUrl: '',
      stat: {} as any,
      columns: [],
      views: [],
      days: {} as any,
      echartTypesInit: {} as any,
      echartColumnsInit: {} as any,
      token: undefined
    };
  },
  created() {
    let { baview_token } = this.$route.query;
    this.baviewToken = String(baview_token || '');
    if (this.baviewToken) {
      this.getBaview();
    } else {
      this.$toast('用户未授权');
    }
  },
  mounted() {
    // 自适应屏幕
    window.addEventListener('resize', this.resizeEcharts);
  },
  computed: {
    types(): { name: string; count: number }[] {
      let { type_stat = {} } = this.stat;
      let types: { name: string; count: number }[] = [];
      Object.keys(type_stat).forEach((key: string) => {
        types.push({ name: typesNames[key as ICmsType], count: type_stat[key] });
      });
      return types;
    },
    today(): string {
      return this.$F.time(new Date().getTime() / 1000, 'yyyy/MM/dd');
    }
  },
  methods: {
    async getBaview() {
      let config = await this.$Model.General.config();
      let { baview_api_url } = config;
      this.baviewApiUrl = baview_api_url;
      this.getStat(); // 获取发布数据总览
      this.getViewRank(); // 获取文章阅读排名
      this.$nextTick(() => {
        this.getTypes(); // 获取发布趋势天统计
        this.getColumnRank(); // 获取栏目排名
      });
    },
    getstatApi() {
      return this.$Model.Cms(this.baviewApiUrl).createPrivate(this.baviewToken);
    },
    getStat() {
      this.getstatApi()
        .countStat()
        .then(data => {
          this.stat = data;
        });
    },
    getTypes() {
      let types = 'default,video'; // 图文、视频
      let stop = new Date(this.today).getTime() / 1000;
      let start = stop - 60 * 60 * 24 * 14;
      this.getstatApi()
        .types(types, { start, stop })
        .then(
          data => {
            this.days = data;
            this.initTypes();
          },
          err => {
            this.$toast(err);
          }
        );
    },
    getViewRank() {
      this.getstatApi()
        .viewRank()
        .then(data => {
          this.views = data;
        });
    },
    getColumnRank() {
      this.getstatApi()
        .columnRank()
        .then(data => {
          this.columns = data;
          this.initColumns();
        });
    },
    resizeEcharts() {
      this.$nextTick(() => {
        this.echartTypesInit.resize();
        this.echartColumnsInit.resize();
      });
    },
    initTypes() {
      let dom = this.$refs.days;
      this.echartTypesInit = echarts.init(dom as HTMLCanvasElement | HTMLDivElement);
      let defaults = this.days['default'] || {};
      let videos = this.days['video'] || {};
      let defaults_days = Object.keys(defaults).map(key => parseInt(key));
      let defaults_data = Object.keys(defaults).map(key => parseInt(defaults[key]));
      let videos_data = Object.keys(defaults).map(key => parseInt(videos[key] || 0));
      let option = {
        grid: { top: '15%', left: '5%', height: '80%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: defaults_days,
          axisLabel: {
            color: '#ababab',
            formatter: (params: any) => {
              return this.$F.time(parseInt(params), 'MM/dd');
            },
            fontSize: 12
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f0f0' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#ababab', fontSize: 12 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f0f0' } }
        },
        series: [
          {
            name: '图文',
            data: defaults_data,
            type: 'line',
            itemStyle: {
              normal: {
                color(params: any) {
                  return '#00AC82';
                }
              }
            },
            lineStyle: { color: '#00AC82', width: 1.2 },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: '#f6fbff' },
                  { offset: 0, color: '#c9e5ff' }
                ])
              }
            }
          },
          {
            name: '视频',
            data: videos_data,
            type: 'line',
            itemStyle: {
              normal: {
                color(params: any) {
                  return '#158FFE';
                }
              }
            },
            lineStyle: { color: '#158FFE', width: 1.2 },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: '#f6fbff' },
                  { offset: 0, color: '#c9e5ff' }
                ])
              }
            }
          }
        ]
      };
      this.echartTypesInit.setOption(option);
    },
    initColumns() {
      let dom = this.$refs.columns;
      this.echartColumnsInit = echarts.init(dom as HTMLCanvasElement | HTMLDivElement);
      let yAxis_data = this.columns.map(({ name }) => name);
      let series_data = this.columns.map(({ count }) => count);
      let option = {
        grid: { left: '3%', right: '4%', top: '13%', height: '80%', containLabel: true },
        xAxis: { show: false, type: 'value' },
        yAxis: {
          type: 'category',
          inverse: true,
          data: yAxis_data,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#333',
            fontSize: 12,
            formatter: (params: any) => {
              if (params.length > 5) {
                return params.substr(0, 5) + '...';
              } else {
                return params;
              }
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: series_data,
            barWidth: 12,
            barMinHeight: 5,
            showBackground: true,
            backgroundStyle: { color: '#f3f3f3', borderColor: '#f3f3f3', borderWidth: 1, barBorderRadius: 10 },
            itemStyle: { color: '#158FFE', barBorderRadius: 10 },
            label: {
              show: true,
              position: 'right',
              textStyle: { color: '#333', fontSize: 12 }
            }
          }
        ]
      };
      this.echartColumnsInit.setOption(option);
    }
  }
});
</script>

<style lang="scss">
.page-cms-stat {
  background: #f4f6f9;
  overflow-x: hidden;

  &__main {
    border-top: 10px solid #f4f6f9;
  }

  &__stat,
  &__types,
  &__views,
  &__columns {
    padding: 5px 13px;
    h2 {
      font-size: 16px;
      font-weight: 400;
      color: #333;
      &::before {
        content: ' ';
        display: inline-block;
        width: 3px;
        height: 13px;
        border-radius: 2px;
        margin-right: 8px;
        background: #158ffe;
      }
      mark {
        float: right;
        background: transparent;
        label {
          font-size: 11px;
          color: #158ffe;
          position: relative;
          margin: 0 4px;
          &::before {
            content: ' ';
            display: inline-block;
            width: 2px;
            height: 10px;
            border-radius: 2px;
            margin-right: 4px;
            background: #158ffe;
          }
          &:first-child {
            color: #34c07b;
            &::before {
              background: #34c07b;
            }
          }
        }
      }
    }
  }

  &__stat {
    &_all {
      color: #fff;
      text-align: center;
      padding: 10px;
      border-radius: 2px;
      background: #34c07b;
      p {
        font-size: 24px;
        margin: 0 0 5px 0;
      }
      span {
        font-size: 11px;
      }
    }
    &_items {
      display: flex;
      flex-wrap: wrap;
      margin: 10px 0;
      border-radius: 2px;
      background: #fff;
      div {
        width: 25%;
        display: inline-block;
        text-align: center;
        position: relative;
        padding: 13px 0;
        &:not(:nth-child(4n + 1)) {
          &::before {
            position: absolute;
            content: '';
            left: 0;
            top: 50%;
            width: 1px;
            height: 13px;
            transform: translateY(-50%);
            background: #eaeaea;
          }
        }
        p {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #333;
        }
        span {
          font-size: 11px;
          color: #7d8c9e;
        }
      }
    }
  }

  &__types {
    &_days {
      height: 184px;
      background: #fff;
    }
  }

  &__views {
    nav,
    li {
      display: flex;
      flex-wrap: nowrap;
      font-size: 14px;
      background: #fff;
      &:nth-child(odd) {
        background: #fafafa;
      }
      span {
        display: inline-block;
        padding: 9px 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #333;
        &.top {
          color: #fe7517;
        }
        &:first-child {
          width: 30px;
        }
        &:nth-child(2) {
          flex: 1;
        }
        &:last-child {
          float: right;
          width: 80px;
        }
      }
    }
    nav {
      background: #fff;
      span {
        color: #999;
      }
    }
  }
  &__columns {
    &_chart {
      height: 350px;
      background: #fff;
    }
  }
}
</style>
