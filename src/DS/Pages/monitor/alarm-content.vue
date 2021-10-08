<template>
  <div class="page-alarm-content">
    <base--topbar :title="content.target_name"></base--topbar>
    <div class="s-main">
      <div class="s-title" @click="go">
        <img src="./_images/UPS@2x.png" v-if="content.type == 'ups'" />
        <img src="./_images/烟雾传感器@2x.png" v-if="content.type == 'detector'" />

        <img src="./_images/server@2x.png" v-if="content.type == 'server'" />
        <img src="./_images/交换机@2x.png" v-if="content.type == 'switchboard'" />
        <img src="./_images/存储@2x.png" v-if="content.type == 'cloud-storage'" />
        <img src="./_images/网卡@2x.png" v-if="content.type == 'ib'" />

        <img src="./_images/sql@2x.png" v-if="content.type == 'database'" />
        <img src="./_images/web@2x.png" v-if="content.type == 'web'" />
        <img src="./_images/应用进程@2x.png" v-if="content.type == 'process'" />

        <img src="./_images/信号@2x.png" v-if="content.type == 'tv-signal'" />
        <div>
          <p>
            {{ content.target_name }}
            <span>{{ content.target_status == CONNECT_STATE.NONE ? '未连接' : '' }}</span>
          </p>
          <footer>
            <span class="s-type">{{ content.type_name || content.type }}</span>
            <span class="s-managers">负责人: {{ managers }}</span>
          </footer>
        </div>
      </div>
      <div class="s-message">
        <h2 :class="{ active: content.is_alarming }">
          <span>{{ content.detail || content.type + '异常' }}</span>
          <label>
            <i v-for="i in content.level" :key="i"></i>
            &nbsp;{{ LEVEL[content.level] }}
          </label>
        </h2>
        <p>
          <label>告警状态:</label>
          <span>{{ content.is_alarming ? '告警中' : '告警已结束' }}</span>
        </p>
        <p>
          <label>告警时间:</label>
          <span>{{ content.alarm_time | ds_time('yyyy-MM-dd hh:mm') }}</span>
        </p>
        <p>
          <label>结束时间:</label>
          <span>{{ content.alarm_stop_time | ds_time('yyyy-MM-dd hh:mm') || '—' }}</span>
        </p>
        <p>
          <label>处理意见:</label>
          <span>{{ content.remark || '—' }}</span>
        </p>
        <p v-if="content.type == 'tv-signal'">
          <label>异常视频:</label>
          <video autoplay controls :src="video.url" v-if="video.url"></video>
          <span v-else>暂无异常视频</span>
        </p>
        <p v-if="content.value_type == VALUE_TYPE.NUM">
          <label>异常走势图:</label>
          <monitor--chartLine :content="lineData" v-if="lineData.id"></monitor--chartLine>
        </p>
      </div>
    </div>
    <footer class="s-footer" v-if="content.is_manager">
      <button @click="popup">处理意见</button>
    </footer>
    <h-popup class="s-popup" v-model="isPopup">
      <textarea placeholder="请输入处理意见" v-model.trim="remark" ref="textarea"></textarea>
      <footer>
        <button class="s-cancel" @click="isPopup = false">取消</button>
        <button class="s-confirm" @click="confirm">确定</button>
      </footer>
    </h-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: {},
      contentId: undefined,
      isPopup: false,
      LEVEL: { 1: '低级告警', 2: '中级告警', 3: '高级告警', 4: '紧急告警' },
      CONNECT_STATE: { NORMAL: 0, NONE: 1, ABNORMAL: 2 },
      remark: '',
      managers: '',
      video: {},
      VALUE_TYPE: {
        NUM: 0,
        ENUMS: 1
      }
    };
  },
  created() {
    let { params } = this.$route;
    let { alarm_id } = params;
    this.contentId = alarm_id;
    this.init();
  },
  computed: {
    lineData() {
      let { content } = this;
      let data = {
        type: content.type,
        id: content.target_id,
        index_key: content.index_key,
        unit_name: content.unit_name,
        alarm_time: content.alarm_time,
        alarm_stop_time: content.alarm_stop_time
      };
      return data;
    }
  },
  methods: {
    init() {
      this.$Model.Monitor.alarms(this.contentId).then(data => {
        this.content = data;
        this.managers = (this.content.managers || []).map(item => item.nickname || item.username).toString();
        // 信号类型获取异常视频
        if (this.content.type == 'tv-signal') {
          this.getVideo();
        }
      });
    },
    getVideo() {
      this.$Model.Monitor.video(this.content.id).then(data => {
        this.video = data;
      });
    },
    popup() {
      this.isPopup = true;
      this.$nextTick(() => {
        this.$refs.textarea.focus();
      });
    },
    go() {
      let { content, CONNECT_STATE } = this;
      let { type, target_id, target_status } = content;
      // 未连接状态不能查看详情
      if (target_status == CONNECT_STATE.NONE) {
        return false;
      }
      if (type == 'ups' || type == 'detector') {
        this.$router.push(`/monitor/machine-roomes/devices/${target_id}`);
      }

      if (type == 'tv-signal') {
        this.$router.push(`/monitor/signals/${target_id}`);
      }
      if (type == 'switchboard' || type == 'ib' || type == 'cloud-storage' || type == 'server') {
        this.$router.push(`/monitor/devices/${target_id}`);
      }
      if (type == 'database' || type == 'web' || type == 'process') {
        this.$router.push(`/monitor/apps/${target_id}`);
      }
    },
    confirm() {
      let { contentId, remark } = this;
      if (!remark.trim()) {
        this.$refs.textarea.focus();
        this.$toast('请输入处理意见');
        return false;
      }
      this.$Model.Monitor.putAlarms(contentId, { remark }).then(data => {
        this.isPopup = false;
        this.$toast('添加成功');
        this.init();
      });
    }
  }
};
</script>

<style lang="scss">
.page-alarm-content {
  position: relative;
  min-height: 100%;
  color: #333;

  .s-main {
    padding-bottom: 70px;

    .monitor--chartLine {
      select {
        display: none;
      }
    }
    .s-title {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
      img {
        width: 46px;
      }
      div {
        margin-left: 10px;
        flex-grow: 1;
        p {
          margin: 0;
          margin-bottom: 5px;
          color: #333;
          span {
            float: right;
            color: #fb4c4c;
          }
        }
        footer {
          display: flex;
          justify-content: space-between;
          span {
            color: #8b8b8b;
            &.s-type {
              white-space: nowrap;
            }
            &.s-managers {
              margin-left: 10px;
            }
          }
        }
      }
    }
    .s-message {
      padding: 0 15px;
      h2 {
        position: relative;
        font-weight: 400;
        color: #666;
        margin: 10px 0;
        span {
          display: block;
          font-size: 18px;
          margin-right: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        label {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          i {
            font-style: normal;
            display: inline-block;
            width: 15px;
            height: 15px;
            background-image: url('./_images/urgent@2x.png');
            background-repeat: no-repeat;
            background-size: cover;
            vertical-align: sub;
          }
        }
        &.active {
          color: #fb4c4c;
          i {
            background-image: url('./_images/urgent-active@2x.png');
          }
        }
      }
      p {
        font-size: 14px;
        span {
          margin-left: 10px;
          color: #8b8b8b;
          word-break: break-word;
        }
        video {
          display: block;
          width: 100%;
          margin: 15px 0;
          background-color: #8c8c8c;
          object-fit: cover;
        }
      }
    }
  }
  .s-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    background-color: #fff;
    button {
      width: 100%;
      background-color: rgb(251, 76, 76);
      border: none;
      font-size: 14px;
      color: #fff;
      padding: 12px;
      border-radius: 5px;
    }
  }
  .s-popup {
    width: 65%;
    padding: 15px;
    textarea {
      width: 100%;
      height: 130px;
      margin-bottom: 10px;
      color: #999;
      text-indent: 5px;
      border: 1px solid #eaeaea;
      background-color: #fafafa;
      resize: none;
      outline: none;
    }
    footer {
      text-align: right;
      button {
        border: none;
        background: none;
        font-size: 13px;
        &.s-cancel {
          color: #999;
        }
        &.s-confirm {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
