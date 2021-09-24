<template>
  <van-pull-refresh class="ds-loadmore" v-model="isTopLoading" success-text="刷新成功" @refresh="onRefresh">
    <!-- <mark class=" ds-loadmore__debug">
      {{ { countOfRefresh, isBottomLoading, bottomAllLoaded, isTopLoading, hasError } }}
    </mark> -->
    <van-list
      v-model="isBottomLoading"
      :finished="bottomAllLoaded"
      :immediate-check="false"
      :offset="200"
      :error.sync="hasError"
      error-text="点击加载更多"
      finished-text="没有更多内容了"
      @load="onLoad"
    >
      <slot></slot>
    </van-list>
  </van-pull-refresh>
</template>

<script>
export default {
  props: {
    bottomMethod: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    topMethod: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    bottomAllLoaded: {
      type: Boolean,
      default: false
    },
    autoFill: {
      type: Boolean,
      default: false
    },
    isFirstLoaded: {
      default: true
    }
  },

  data() {
    return {
      hasError: false,
      isTopLoading: false,
      isBottomLoading: false,
      countOfRefresh: 0
    };
  },

  methods: {
    onRefresh() {
      // console.log('onRefresh', [this.isTopLoading, this.isBottomLoading]);
      if (!this.isBottomLoading) {
        // 在没有底部加载时才刷新
        this.countOfRefresh++;
        this.topMethod();
        // console.log('onRefresh ......');
      } else {
        this.isTopLoading = false;
      }
    },
    onLoad() {
      // console.log('onLoad', [this.isTopLoading, this.isBottomLoading]);
      if (!this.isTopLoading && this.isFirstLoaded) {
        // 在没有刷新时/loadFirst完成时才加载更多
        this.bottomMethod();
        // console.log('onLoad ......');
      } else {
        this.isBottomLoading = false;
      }
    },

    // 对外暴露的接口
    onTopLoaded() {
      // console.log('onTopLoaded');
      this.isTopLoading = false;
    },
    // 对外暴露的接口
    onBottomLoaded(e) {
      // console.log('onBottomLoaded');
      if (e) {
        this.hasError = true;
      }
      this.isBottomLoading = false;
    }
  }
};
</script>

<style lang="scss">
.ds-loadmore {
  &__debug {
    position: fixed;
    top: 0;
    right: 0;
  }
}
</style>
