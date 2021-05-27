<template>
  <div class="monitor--signal-playbacks">
    <h2>信号回看</h2>
    <div class="monitor--signal-playbacks-days">
      <div
        :class="['monitor--signal-playbacks-day', item.id == activeIndex && 'active']"
        v-for="item in dates"
        :key="item.id"
        @click="changeDay(item)"
      >
        <span>{{ item.time | ds_time('MM.dd') }}</span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <ul>
      <li v-for="(item, index) in playbacks" :key="index" @click="to(item)">
        <img src="./_images/signal-icon.png" alt="" />
        <time>{{ item.index | filter_time }}</time>
        <span :class="{ active: item.playback_address }">{{ item.playback_address ? '播放' : '文件不存在' }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    content: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      activeIndex: 0,
      date: '',
      dates: [
        { id: 1, name: '周一', time: 0 },
        { id: 2, name: '周二', time: 0 },
        { id: 3, name: '周三', time: 0 },
        { id: 4, name: '周四', time: 0 },
        { id: 5, name: '周五', time: 0 },
        { id: 6, name: '周六', time: 0 },
        { id: 0, name: '周日', time: 0 }
      ],
      playbacks: [] as any[]
    };
  },
  created() {
    this.init();
  },
  filters: {
    filter_time(index: number) {
      let startHour = String(index).padStart(2, '0');
      let stopHour = String(index + 1).padStart(2, '0');
      return `${startHour}:00 - ${stopHour}:00`;
    }
  },
  computed: {
    today() {
      let date = (this.constructor as any).filter('ds_time')(Date.now() / 1000, 'yyyy/MM/dd');
      let timestamp: any = new Date(date).getTime() / 1000;
      return parseInt(timestamp);
    }
  },
  methods: {
    async init() {
      this.modifyDates();
      this.getPlaybacks();
    },
    async getPlaybacks() {
      this.playbacks = (await this.$Model.Monitor.playbacks(this.content.id, this.date))?.reverse();
    },
    modifyDates() {
      let day = new Date().getDay();
      this.activeIndex = day;
      this.date = (this.constructor as any).filter('ds_time')(Date.now() / 1000, 'yyyy-MM-dd');
      this.dates.forEach(item => {
        if (item.id == day) {
          item.name = '今天';
          item.time = this.today;
        } else {
          item.time =
            item.id < day
              ? this.today - 60 * 60 * 24 * (day - item.id)
              : this.today - 60 * 60 * 24 * (day + (7 - item.id));
        }
      });
      this.dates.sort((a, b) => a.time - b.time);
    },
    to(item: any) {
      if (item.playback_address) {
        this.$router.push(`/signals/${this.content.id}/${this.date}/playback/${item.index + 1}`);
      }
    },
    changeDay(item: any) {
      this.activeIndex = item.id;
      this.date = (this.constructor as any).filter('ds_time')(item.time, 'yyyy-MM-dd');
      this.getPlaybacks();
    }
  }
});
</script>

<style lang="scss">
.monitor--signal-playbacks {
  h2 {
    font-weight: 400;
    font-size: 14px;
    color: #999;
    margin: 10px 15px;
  }
  &-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    color: #333;

    &.active {
      span {
        color: #1890ff !important;
      }
    }

    span:first-child {
      font-size: 12px;
      color: #999;
      padding-bottom: 2px;
    }

    &s {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid #eaeaea;
    }
  }
  ul {
    li {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid #eaeaea;
      img {
        width: 30px;
        height: 30px;
      }
      time {
        color: #333;
        font-size: 16px;
        flex: 1;
        padding: 0 10px;
      }
      span {
        color: #999;
        font-size: 14px;
        &.active {
          color: #1890ff;
          &::before {
            content: ' ';
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: text-bottom;
            padding-right: 5px;
            background-image: url('./_images/play.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>
