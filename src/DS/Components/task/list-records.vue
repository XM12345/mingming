<template>
  <div class="task--list-records">
    <h3>任务进度</h3>
    <ul class="s-list">
      <li class="s-list-item" v-for="item in contents" :key="item.id">
        <time>{{ item.operate_time | ds_time('MM-dd') }}<br />{{ item.operate_time | ds_time('hh:mm') }}</time>
        <div class="s-line">
          <i></i>
          <span></span>
        </div>
        <div class="s-des">
          <p>{{ item.operator_nickname }}{{ item.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    taskId: {
      required: true,
      default: undefined
    }
  },
  data() {
    return {
      contents: []
    };
  },
  created() {
    this.init();
  },
  mounted() {
    // 刷新操作纪录
    window.DfsxWeb.freshLogs = this.init;
  },
  methods: {
    init() {
      this.$Model.Subject.task_logs(this.taskId).then(data => {
        this.contents = data.reverse();
      });
    }
  }
};
</script>

<style lang="scss">
.task--list-records {
  h3 {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  .s-list {
    margin: 10px 0;
    &-item {
      display: flex;
      padding: 0 13px;
      &:last-child {
        i {
          display: none;
        }
      }
      &:first-child {
        .s-line span {
          background: #1890ff;
        }
        .s-des {
          p {
            color: #101010;
          }
        }
      }
      time {
        width: 31px;
        color: #999;
        font-size: 12px;
      }
      .s-line {
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
      .s-des {
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
}
</style>
