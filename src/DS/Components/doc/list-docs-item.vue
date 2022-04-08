<template>
  <li :class="[B()]">
    <mark v-if="index > -1">{{ index + 1 }}</mark>
    <div @click="to(item.id)">
      <h3 :class="{ isMark: index === -1 }" v-html="item.title">{{ item.title }}</h3>
      <p>
        <span>{{ item.col_name }}</span>
        <span>{{ item.used_num ? '已引用' : '未引用' }}</span>
        <span :class="className(item.status)">{{ item.status_name }}</span>
      </p>
    </div>
    <label role="checkbox" :class="{ isChecked: item.isChecked === true }" @click="check(item)"></label>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'doc--list-docs-item',
  props: {
    item: { type: Object, default: () => ({}) },
    index: { type: Number, default: -1 }
  },
  methods: {
    className(status: number) {
      let data = status == 0 ? 'no_start' : status == 10 ? 'success' : status == 9 ? 'fail' : '';
      return data;
    },
    check(item: any) {
      this.$emit('check', item);
    },
    to(id: number) {
      this.$toPage('doc', id);
    }
  }
});
</script>

<style lang="scss">
.doc--list-docs-item {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 13px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f1f1;
  & > div {
    flex: 1;
    display: block;
    overflow: hidden;
    h3 {
      font-size: 15px;
      color: #343434;
      font-weight: 500;
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      em {
        font-style: normal;
        &.isMark {
          color: #ed4040;
        }
      }
    }
    p {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: space-between;
      color: #9a9a9a;
      font-size: 12px;
      span {
        width: 33%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &.no_start {
          color: #999;
        }
        &.success {
          color: #44c288;
        }
        &.fail {
          color: #f64d65;
        }
      }
    }
  }
  & > mark {
    width: 30px;
    color: #666;
    font-size: 18px;
    background-color: transparent;
  }
  label {
    border-radius: 50%;
    border: 1px solid #666;
    padding: 5px;
    margin: 10px;
    &.isChecked {
      background: url('../../Pages/weixin/_images/checked@2x.png');
      background-repeat: no-repeat;
      background-size: 100%;
      border: none;
      padding: 6px;
    }
  }
}
</style>
