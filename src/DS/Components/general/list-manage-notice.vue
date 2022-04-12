<template>
  <h-loadmore ref="loadmore" :class="[B()]" :onLoad="onLoad">
    <template #list="{ data }">
      <h-link v-for="item in data" :key="item.id" :class="[B('__item')]" :to="`/notices/manage/${item.id}`">
        <div :class="[B('__item_main')]">
          <div :class="[B('__item_title')]">{{ item.title }}</div>
          <div :class="[B('__item_message')]">
            <span>{{ item.author_nickname || item.author_name }}</span>
            <time> {{ $F.time(parseInt(item.creation_time), '', '创建') }}</time>
            <span :class="[B('__item_message_status'), `--${statusClassName(item.status)}`]">
              {{ statusName(item.status) }}
            </span>
          </div>
        </div>
        <mark :class="[B('__item_arrow')]"></mark>
      </h-link>
    </template>
  </h-loadmore>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'general--list-manage-notice',
  props: {
    status: { type: Number, default: 0 },
    sort: { type: Number, default: 0 }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onLoad(page: number, size: number) {
      return this.$Model.General.notices({ status: this.status, sort: this.sort, page, size });
    },
    statusName(status: number) {
      return ['草稿', '上线', '下线', '待审', '审核通过', '审核退回'][status - 1];
    },
    statusClassName(status: number) {
      return ['draft', 'online', 'offline', 'pending', 'pass', 'fail'][status - 1];
    }
  }
});
</script>

<style lang="scss">
.general--list-manage-notice {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f1f1f1;

    &_main {
      flex: 1;
      margin-right: 10px;
    }

    &_title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      margin-bottom: 10px;
      color: #333;
      font-size: 14px;
    }

    &_message {
      color: #999;
      font-size: 12px;
      span,
      time {
        margin-right: 10px;
      }
      &_status {
        display: inline-block;
        text-align: center;
        width: 58px;
        height: 24px;
        line-height: 24px;
        border-radius: 4px;
        white-space: nowrap;
        &.--online {
          color: #3ed0af;
          background: rgba(62, 208, 175, 0.1);
        }
        &.--pending {
          color: #ffae33;
          background: #fff6ea;
        }
        &.--fail {
          color: #f56c6b;
          background: #fef1f1;
        }
        &.--offline,
        &.--draft {
          color: #666666;
          background: #ebebeb;
        }
        &.--pass {
          color: #1890ff;
          background: rgba(#1890ff, 0.1);
        }
      }
    }

    &_arrow {
      display: inline-block;
      background: transparent;
      border: 1px solid #999;
      border-top: none;
      border-left: none;
      height: 10px;
      width: 10px;
      transform: rotate(-45deg) translate(0, -5px);
      transform-origin: bottom;
    }
  }
}
</style>
