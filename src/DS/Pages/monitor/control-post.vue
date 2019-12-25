<template>
  <div class="page-control-post">
    <base--topbar :title="title">
      <button @click="submit">确定</button>
    </base--topbar>
    <div class="s-picker">
      <header class="s-picker-header">
        <p :class="{ active: isStart == true }" @click="(isStart = true), (isEnd = false)">
          <span>开始时间</span>
          {{ issueStart }}
        </p>
        <p :class="{ active: isEnd == true }" @click="(isStart = false), (isEnd = true)">
          <span>结束时间</span>
          {{ issueEnd }}
        </p>
      </header>
      <mt-picker :slots="slots" @change="onValuesChange" v-if="start_time > -1"></mt-picker>
    </div>
    <div class="s-days">
      <h2>重复</h2>
      <ul>
        <li v-for="(item, index) in days" :key="index">
          <p>
            <span>{{ item }}</span>
          </p>
          <label
            role="checkbox"
            :class="{ isChecked: days_of_week.includes(index + 1) }"
            @click="change(index + 1)"
          ></label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: {},
      issueStart: '',
      issueEnd: '',
      isStart: true,
      isEnd: false,
      index: -1,
      modify_data: undefined,
      start_time: -1,
      stop_time: 0,
      slots: [],
      days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      days_of_week: [2, 3, 4, 5, 6],
      title: '新增提示'
    };
  },
  created() {
    let { params } = this.$route;
    let { index } = params;
    this.index = index;
    // 通过index判断是否是修改预警设置
    if (this.index > -1) {
      this.title = '修改提示';
    }
    this.init();
  },
  methods: {
    init() {
      let valuesHour = Array.from(Array(24), (v, k) => k.toString().padStart(2, '0'));
      let valuesMin = Array.from(Array(60), (v, k) => k.toString().padStart(2, '0'));
      let indexHour = 9;
      let indexMin = 30;
      this.$Model.Monitor.settings().then(data => {
        this.content = data;
        if (this.index > -1) {
          this.modify_data = this.content.alarm_message_calendars[this.index];
          let { days_of_week, start_time, stop_time } = this.modify_data;
          this.days_of_week = days_of_week;
          indexHour = Math.floor(start_time / 60);
          indexMin = start_time % 60;
          this.stop_time = stop_time;
          let h = (Math.floor(stop_time / 60) + '').padStart(2, '0');
          let m = ((stop_time % 60) + '').padStart(2, '0');
          this.issueEnd = h + ':' + m;
        }
        this.slots = [
          { values: valuesHour, defaultIndex: indexHour, className: 'slot1', textAlign: 'right' },
          { values: valuesMin, defaultIndex: indexMin, className: 'slot2', textAlign: 'left' }
        ];
        this.start_time = indexHour * 60 + indexMin;
      });
    },
    onValuesChange(picker, values) {
      let { isStart, isEnd } = this;
      let new_values = values.map(Number);
      if (isStart == true) {
        this.issueStart = values.toString().replace(/,/, ':');
        this.start_time = new_values[0] * 60 + new_values[1];
      } else if (isEnd == true) {
        this.issueEnd = values.toString().replace(/,/, ':');
        this.stop_time = new_values[0] * 60 + new_values[1];
      }
    },
    change(item) {
      let { days_of_week } = this;
      if (days_of_week.includes(item)) {
        let index = days_of_week.findIndex(i => i == item);
        days_of_week.splice(index, 1);
      } else {
        days_of_week.unshift(item);
      }
      this.days_of_week = days_of_week.sort();
    },
    submit() {
      let { start_time, stop_time, days_of_week } = this;
      if (stop_time < start_time) {
        this.$toast('结束时间必须大于开始时间');
        return false;
      }
      if (!days_of_week.length) {
        this.$toast('请选择重复天数');
        return false;
      }
      let content = JSON.parse(JSON.stringify(this.content));
      let add_data = {
        start_time,
        stop_time,
        days_of_week,
        is_on: true
      };
      if (this.index > -1) {
        content.alarm_message_calendars[this.index] = add_data;
      } else {
        content.alarm_message_calendars.push(add_data);
      }
      this.$Model.Monitor.putSettings(content).then(() => {
        this.$toast('保存成功');
        this.$navigation.cleanRoutes();
        this.$router.back();
      });
    }
  }
};
</script>

<style lang="scss">
.page-control-post {
  .h-topbar {
    button {
      position: absolute;
      width: 40px;
      height: 40px;
      right: 0;
      top: 0;
      font-size: 14px;
      color: #1890ff;
      border: none;
      background: none;
    }
  }
  .s-picker {
    &-header {
      border-bottom: 1px solid #eee;
      p {
        position: relative;
        color: #333;
        font-size: 15px;
        text-align: center;
        height: 32px;
        line-height: 32px;
        margin: 0 15px;
        span {
          position: absolute;
          left: 0;
        }
        &.active {
          color: #1890ff;
        }
      }
    }
    .picker {
      &-slot {
        width: 100%;
        .picker-item {
          color: #999;
          font-size: 14px;
        }
        .picker-selected {
          color: #1890ff;
          font-size: 17px;
          background-color: rgba(24, 144, 255, 0.07);
        }
      }
    }
  }
  .s-days {
    h2 {
      font-weight: 400;
      color: #999;
      font-size: 14px;
      margin: 0;
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
    }
    ul {
      li {
        position: relative;
        padding: 10px;
        background-color: #fff;
        p {
          margin: 0;
          padding-right: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            font-size: 15px;
            color: #333;
            vertical-align: middle;
            padding-left: 10px;
          }
        }
        label {
          position: absolute;
          top: 50%;
          right: 0;
          border-radius: 50%;
          border: 1px solid #999;
          padding: 7px;
          margin: 0 10px;
          transform: translateY(-50%);
          &.isChecked {
            background: url('./_images/checked@2x.png');
            background-repeat: no-repeat;
            background-size: cover;
            border: none;
            padding: 8px;
          }
        }
      }
    }
  }
}
</style>
