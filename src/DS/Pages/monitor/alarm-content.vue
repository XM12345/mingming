<template>
  <div :class="[B()]">
    <h-topbar :title="title"></h-topbar>

    <div v-if="content" :class="[B('__main')]">
      <div :class="[B('__content')]" @click="go">
        <img v-if="content.type === 'ups'" src="./_images/UPS@2x.png" />
        <img v-if="content.type === 'detector'" src="./_images/烟雾传感器@2x.png" />
        <img v-if="content.type === 'server'" src="./_images/server@2x.png" />
        <img v-if="content.type === 'switchboard'" src="./_images/交换机@2x.png" />
        <img v-if="content.type === 'cloud-storage'" src="./_images/存储@2x.png" />
        <img v-if="content.type === 'ib'" src="./_images/网卡@2x.png" />
        <img v-if="content.type === 'database'" src="./_images/sql@2x.png" />
        <img v-if="content.type === 'web'" src="./_images/web@2x.png" />
        <img v-if="content.type === 'process'" src="./_images/应用进程@2x.png" />
        <img v-if="content.type === 'tv-signal'" src="./_images/信号@2x.png" />
        <div :class="[B('__content_main')]">
          <p :class="[B('__content_name')]">
            {{ content.target_name }}
            <span>{{ content.target_status === CONNECT_STATE.NONE ? '未连接' : '' }}</span>
          </p>
          <footer :class="[B('__content_message')]">
            <span :class="[B('__content_message_type')]">{{ content.type_name || content.type }}</span>
            <span :class="[B('__content_message_managers')]">负责人: {{ managers }}</span>
          </footer>
        </div>
      </div>

      <div :class="[B('__message')]">
        <h2 :class="[B('__message_title'), content.is_alarming && 'active']">
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
          <span>{{ $F.time(content.alarm_time, 'yyyy-MM-dd hh:mm') }}</span>
        </p>
        <p>
          <label>结束时间:</label>
          <span>{{ $F.time(content.alarm_stop_time, 'yyyy-MM-dd hh:mm') || '—' }}</span>
        </p>
        <p>
          <label>处理意见:</label>
          <span>{{ content.remark || '—' }}</span>
        </p>
        <p v-if="content.type === 'tv-signal'">
          <label>异常视频:</label>
          <video v-if="video.url" autoplay controls :src="video.url"></video>
          <span v-else>暂无异常视频</span>
        </p>
        <p v-if="content.value_type === VALUE_TYPE.NUM">
          <label>异常走势图:</label>
          <monitor--chartLine v-if="lineData.id" :class="[B('__chartLine')]" :content="lineData"></monitor--chartLine>
        </p>
      </div>
    </div>

    <footer v-if="content && content.is_manager" :class="[B('__footer')]">
      <button @click="popup">处理意见</button>
    </footer>

    <h-popup v-model="isPopup" :class="[B('__audit')]">
      <textarea ref="textarea" v-model.trim="remark" placeholder="请输入处理意见"></textarea>
      <footer>
        <button :class="[B('__audit_cancel')]" @click="isPopup = false">取消</button>
        <button :class="[B('__audit_confirm')]" @click="confirm">确定</button>
      </footer>
    </h-popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-monitor-alarm-content',
  data() {
    return {
      content: null as any,
      contentId: 0,
      isPopup: false,
      LEVEL: { 1: '低级告警', 2: '中级告警', 3: '高级告警', 4: '紧急告警' },
      CONNECT_STATE: { NORMAL: 0, NONE: 1, ABNORMAL: 2 },
      remark: '',
      managers: '',
      video: {} as any,
      VALUE_TYPE: {
        NUM: 0,
        ENUMS: 1
      }
    };
  },
  computed: {
    title(): string {
      return this.content?.target_name || '';
    },
    lineData(): any {
      return {
        type: this.content?.type,
        id: this.content?.target_id,
        index_key: this.content?.index_key,
        unit_name: this.content?.unit_name,
        alarm_time: this.content?.alarm_time,
        alarm_stop_time: this.content?.alarm_stop_time
      };
    }
  },
  created() {
    let { alarm_id } = this.$route.params;
    this.contentId = Number(alarm_id) || 0;
    this.init();
  },
  methods: {
    init() {
      this.$Model.Monitor.alarms(this.contentId).then(data => {
        this.content = data;
        this.managers = (this.content.managers || []).map((item: any) => item.nickname || item.username).toString();
        // 信号类型获取异常视频
        if (this.content.type === 'tv-signal') {
          this.getVideo();
        }
      });
    },
    getVideo() {
      this.$Model.Monitor.video(this.content?.id).then(data => {
        this.video = data;
      });
    },
    popup() {
      this.isPopup = true;
      this.$nextTick(() => {
        (this.$refs.textarea as any).focus();
      });
    },
    go() {
      if (this.content?.target_status === this.CONNECT_STATE.NONE) {
        return false;
      }
      if (['ups', 'detector'].includes(this.content?.type)) {
        this.$router.push(`/monitor/machine-roomes/devices/${this.content?.target_id}`);
      }

      if (this.content?.type === 'tv-signal') {
        this.$router.push(`/monitor/signals/${this.content?.target_id}`);
      }
      if (['switchboard', 'ib', 'cloud-storage', 'server'].includes(this.content?.type)) {
        this.$router.push(`/monitor/devices/${this.content?.target_id}`);
      }
      if (['database', 'web', 'process'].includes(this.content?.type)) {
        this.$router.push(`/monitor/apps/${this.content?.target_id}`);
      }
    },
    confirm() {
      if (!this.remark.trim()) {
        (this.$refs.textarea as any).focus();
        this.$toast('请输入处理意见');
        return false;
      }
      this.$Model.Monitor.putAlarms(this.contentId, { remark: this.remark }).then(data => {
        this.isPopup = false;
        this.$toast('添加成功');
        this.init();
      });
    }
  }
});
</script>

<style lang="scss">
.page-monitor-alarm-content {
  position: relative;
  min-height: 100%;
  color: #333;

  &__main {
    padding-bottom: 70px;
  }

  &__content {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    img {
      width: 46px;
    }
    &_main {
      margin-left: 10px;
      flex-grow: 1;
    }
    &_name {
      margin: 0;
      margin-bottom: 5px;
      color: #333;
      span {
        float: right;
        color: #fb4c4c;
      }
    }
    &_message {
      display: flex;
      justify-content: space-between;
      color: #8b8b8b;
      &_type {
        white-space: nowrap;
      }
      &_managers {
        margin-left: 10px;
      }
    }
  }

  &__chartLine {
    select {
      display: none;
    }
  }
  &__message {
    padding: 0 15px;
    &_title {
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
  &__footer {
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
  &__audit {
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
    }
    &_cancel,
    &_confirm {
      border: none;
      background: none;
      font-size: 13px;
      color: #1890ff;
    }
    &_cancel {
      color: #999;
    }
  }
}
</style>
