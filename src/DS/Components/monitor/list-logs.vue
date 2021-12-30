<template>
  <div class="monitor--list-logs">
    <h2>告警日志</h2>
    <div>
      <h-link :to="`/monitor/alarms/${item.id}`" v-for="item in logs" :key="item.id">
        <p>
          <label>{{ item.detail }}</label>
          <span :class="{ active: item.is_alarming }">{{ item.is_alarming ? '告警中' : '已恢复' }}</span>
        </p>
        <footer>
          <span :class="{ active: item.is_alarming }">
            <i v-for="i in item.level" :key="i"></i>
            &nbsp;{{ levelName(item) }}
          </span>
          <time>{{ $F.time(item.alarm_time, 'yyyy-MM-dd hh:mm') }}</time>
        </footer>
      </h-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, default: {} }
  },
  data() {
    return {
      logs: []
    };
  },
  created() {
    this.init();
  },
  watch: {
    content() {
      this.init();
    }
  },
  methods: {
    init() {
      let { content } = this;
      let { type, id } = content;
      this.$Model.Monitor.alarmList(type, id).then(data => {
        this.logs = data.data;
      });
    },
    levelName(item) {
      /*  <int, 等级 1-低级2-中级3-高级4-紧急>, */
      let levels = ['低级告警', '中级告警', '高级告警', '紧急告警'];
      return levels[item.level - 1] || '';
    }
  }
};
</script>

<style lang="scss">
.monitor--list-logs {
  font-size: 14px;
  color: #333;
  border-bottom: 10px solid #f4f6f9;
  h2 {
    font-weight: 400;
    font-size: 14px;
    color: #999;
    margin: 10px 15px;
  }
  div {
    a {
      display: block;
      color: #333;
      padding: 10px 15px;
      border-bottom: 1px solid #eaeaea;
      p {
        margin: 0;
        margin-bottom: 5px;
        min-height: 19px;
        position: relative;
        label {
          display: block;
          margin-right: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          &.active {
            color: #fb4c4c;
          }
        }
      }
      footer {
        color: #999;
        span {
          i {
            font-style: normal;
            display: inline-block;
            width: 15px;
            height: 15px;
            background-image: url('../../Pages/monitor/_images/urgent@2x.png');
            background-repeat: no-repeat;
            background-size: cover;
            vertical-align: sub;
          }
          &.active {
            color: #fb4c4c;
            i {
              background-image: url('../../Pages/monitor/_images/urgent-active@2x.png');
            }
          }
        }
        time {
          float: right;
        }
      }
    }
  }
}
</style>
