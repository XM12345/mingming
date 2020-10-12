<template>
  <li class="doc--list-docs-item">
    <mark v-if="index > -1">{{ index + 1 }}</mark>
    <router-link :to="`/docs/${item.id}`">
      <h3 :class="{ isMark: index == -1 }" v-html="item.title">{{ item.title }}</h3>
      <p>
        <span>{{ item.col_name }}</span
        ><span>{{ item.used_num ? '已引用' : '未引用' }}</span
        ><span :class="item.status | filter_class">{{ item.status_name }}</span>
      </p>
    </router-link>
    <label role="checkbox" :class="{ isChecked: item.isChecked == true }" @click="check(item)"></label>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      default: {}
    },
    index: {
      default: -1
    }
  },
  filters: {
    filter_class(status) {
      let data = status == 0 ? 'no_start' : status == 10 ? 'success' : status == 9 ? 'fail' : '';
      return data;
    }
  },
  methods: {
    check(item) {
      this.$emit('check');
    }
  }
};
</script>

<style lang="scss">
.doc--list-docs-item {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 13px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f1f1;
  & > a {
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
