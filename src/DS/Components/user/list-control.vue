<template>
  <div class="user--list-control" @click="blur()">
    <h2>预警提示时间</h2>

    <ul>
      <li
        v-for="(item, index) in content.alarm_message_calendars"
        :key="index"
        @touchstart="touchstart(item, index)"
        @touchend="touchend(item)"
      >
        <div @click="modify(index)">
          <p>{{ item.start_time | filter_time }}-{{ item.stop_time | filter_time }}</p>
          <span>{{ item.days_of_week | filter_day }}</span>
        </div>
        <mt-switch v-model="item.is_on" @change.self="change(item, index)"></mt-switch>
        <mark @click.stop="del(item, index)" v-if="isDelete && index == activeIndex">删除</mark>
      </li>
    </ul>
    <router-link to="/control/settings" class="s-add">+</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      content: {},
      isDelete: false,
      intervalId: 0
    };
  },
  filters: {
    filter_time(time) {
      let h = (Math.floor(time / 60) + '').padStart(2, '0');
      let m = ((time % 60) + '').padStart(2, '0');
      return h + ':' + m;
    },
    filter_day(day) {
      let days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      let result = day
        .map(item => days[item - 1])
        .toString()
        .replace(/,/g, '、');
      return result;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$Model.Monitor.settings().then(data => {
        this.content = data;
      });
    },
    touchstart(item, index) {
      this.intervalId = setInterval(() => {
        this.isDelete = true;
        this.activeIndex = index;
      }, 600);
    },
    touchend(item) {
      clearInterval(this.intervalId);
    },
    blur() {
      this.isDelete = false;
    },
    del(item, index) {
      this.isDelete = false;
      this.content.alarm_message_calendars.splice(index, 1);
      this.putConfig();
      this.$toast('删除成功');
    },
    change(item, index) {
      this.content.alarm_message_calendars[index].is_on = item.is_on;
      this.putConfig();
    },
    modify(index) {
      this.$router.push(`/control/settings/${index}`);
    },
    putConfig() {
      this.$Model.Monitor.putSettings(this.content).then(() => {
        this.init();
      });
    }
  }
};
</script>

<style lang="scss">
.user--list-control {
  height: 100%;
  h2 {
    font-weight: 400;
    color: #8c8c8c;
    font-size: 14px;
    margin: 0;
    padding: 8px 13px;
    border-bottom: 1px solid #eee;
    background: #fff;
  }
  ul {
    li {
      position: relative;
      background: #fff;
      padding: 10px 60px 10px 13px;
      border-bottom: 1px solid #eee;

      p {
        margin: 0;
        margin-bottom: 5px;
      }
      span {
        font-size: 12px;
        color: rgb(16, 16, 16);
      }
      .mint-switch {
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translateY(-50%);
        &-core {
          width: 40px;
          height: 20px;
          &::before {
            width: 38px;
            height: 18px;
          }
          &::after {
            width: 18px;
            height: 18px;
          }
        }
      }
      mark {
        position: absolute;
        left: 50px;
        bottom: -30px;
        background: #fff;
        padding: 8px 20px;
        box-shadow: 1px 1px 5px #ddd;
        color: #333;
        font-size: 14px;
        border-radius: 3px;
        z-index: 999;
        &::after {
          content: '';
          position: absolute;
          top: -4px;
          left: 8px;
          transform: rotate(225deg);
          width: 8px;
          height: 8px;
          background-color: #fff;
          border: 1px #f2f2f2;
          border-style: none solid solid none;
        }
      }
    }
  }
  .s-add {
    display: block;
    position: fixed;
    right: 20px;
    bottom: 70px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 26px;
    border-radius: 50%;
    background-color: rgb(86, 119, 252);
  }
}
</style>
