<template>
  <h-loadmore ref="loadmore" :class="[B()]" :onLoad="onLoad">
    <template #list="{ data }">
      <h-link
        v-for="item in data"
        :key="item.id"
        :class="[B('__item'), item.has_read && 'readed']"
        :to="`/notices/${item.id}`"
        @click.native="item.has_read = true"
      >
        <div :class="[B('__item_main')]">
          <div :class="[B('__item_title')]">{{ item.title }}<label v-if="!item.has_read"></label></div>
          <div :class="[B('__item_message')]">
            <span>{{ item.author_nickname || item.author_name }}</span>
            <time>{{ $F.time(parseInt(item.publish_time), '', '发布') }}</time>
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
  name: 'general--list-notice',
  props: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    onLoad(page: number, size: number) {
      return this.$Model.General.v2Notices({ page, size });
    }
  }
});
</script>

<style lang="scss">
.general--list-notice {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f1f1f1;
    &.readed &_title {
      color: #999;
    }
    &_main {
      flex: 1;
      margin-right: 10px;
    }
    &_title {
      position: relative;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      margin-bottom: 10px;
      color: #333;
      font-size: 14px;
      label {
        position: absolute;
        top: 6px;
        right: 0px;
        width: 6px;
        height: 6px;
        background-color: #ed4040;
        border-radius: 50%;
      }
    }
    &_message {
      color: #999;
      font-size: 12px;
      span,
      time {
        margin-right: 10px;
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
