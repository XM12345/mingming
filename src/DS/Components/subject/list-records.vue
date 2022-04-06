<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">任务进度</h3>
    <ul :class="[B('__list')]">
      <li v-for="item in logs" :key="item.id" :class="[B('__item')]">
        <time>{{ $F.time(item.operate_time, 'MM-dd') }}<br />{{ $F.time(item.operate_time, 'hh:mm') }}</time>
        <div :class="[B('__item_line')]">
          <i></i>
          <span></span>
        </div>
        <div :class="[B('__item_description')]">
          <p>{{ item.operator_nickname }}{{ item.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'subject--list-records',
  props: {
    taskId: { required: true, type: Number, default: 0 }
  },
  data() {
    return {
      logs: [] as any[]
    };
  },
  created() {
    this.init();
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshLogs = this.init;
    }
  },
  methods: {
    async init() {
      let logs = await this.$Model.Subject.task_logs(this.taskId);
      this.logs = logs.reverse();
    }
  }
});
</script>

<style lang="scss">
.subject--list-records {
  &__title {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  &__list {
    margin: 10px 0;
  }
  &__item {
    display: flex;
    padding: 0 13px;
    &:last-child {
      i {
        display: none;
      }
    }
    &:first-child &_line span {
      background: #1890ff;
    }
    &:first-child &_description p {
      color: #101010;
    }

    time {
      width: 31px;
      color: #999;
      font-size: 12px;
    }
    &_line {
      position: relative;
      margin: 0 15px;
      i {
        position: absolute;
        left: 4px;
        width: 2px;
        height: 100%;
        background: #bfbfbf;
      }
      span {
        position: relative;
        width: 10px;
        height: 10px;
        display: block;
        border-radius: 50%;
        background: #bfbfbf;
      }
    }
    &_description {
      flex: 1;
      margin-bottom: 30px;
      p {
        color: #999;
        font-size: 14px;
        margin: 0 0 5px 0;
        padding: 0;
      }
      span {
        color: #666;
        font-size: 12px;
      }
    }
  }
}
</style>
