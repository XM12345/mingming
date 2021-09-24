<template>
  <van-pull-refresh
    :class="[B()]"
    :style="{ height }"
    :value="isRefreshLoading"
    @input="cancelRefresh"
    success-text="刷新成功"
    @refresh="doRefresh"
  >
    <van-list
      :value="isMoreLoading"
      @input="cancelLoad"
      :finished="isFinished"
      :immediate-check="false"
      :offset="200"
      :error.sync="hasError"
      error-text="加载失败, 点击重试"
      finished-text="没有更多内容了"
      @load="doLoad"
    >
      <slot name="list" :data="data" :total="total">
        <!-- <div v-for="(item, index) in data" :key="index">{{ index }}</div> -->
      </slot>
      <h-transition>
        <template v-if="isEmpty">
          <slot name="empty">
            <div :class="[B('__empty')]">
              <!-- TODO: 图片从 props 获取? -->
              <img src="./images/nodata.png" alt="" />
            </div>
          </slot>
        </template>
      </h-transition>
      <!-- TODO 优化默认error状态 -->
    </van-list>
  </van-pull-refresh>
</template>

<script lang="ts">
/**
 * h-loadmore 无限列表加载组件
 * @example
 *  <h-loadmore :onLoad="onLoad">
 *    <template #list="{ data, total }">
 *      {{ total }}
 *      <demo-item v-for="(item, index) in data" :key="item.id">{{ index }}.{{ item }}</demo-item>
 *    </template>
 *    <template #empty><div>暂无数据</div></template>
 *  </h-loadmore>
 */
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'h-loadmore',
  props: {
    /** @deprecated */
    height: { default: '', type: String },
    onLoad: {
      required: true,
      type: Function as PropType<(page: number, size?: number) => Promise<{ data: any[]; total: number }>>
    }
  },
  data() {
    return {
      size: 20,

      page: 1,
      total: 0,
      data: [] as any[],
      isNoMoreData: false,

      isRefreshLoading: false,
      isMoreLoading: false,
      hasError: false
    };
  },

  computed: {
    isEmpty(): boolean {
      return !this.isLoading && this.isNoMoreData && this.total === 0 && this.page === 1;
    },
    isFinished(): boolean {
      return this.isNoMoreData && this.page > 1;
    },
    isLoading(): boolean {
      return this.isRefreshLoading || this.isMoreLoading;
    }
  },

  methods: {
    async doRefresh(notShowRefreshUI = false) {
      // console.log('doRefresh', this.isLoading);
      if (!this.isLoading) {
        this.hasError = false;

        this.page = 1;
        // this.data = [];
        this.total = 0;
        this.isNoMoreData = false;

        this.isRefreshLoading = !notShowRefreshUI;
        try {
          let { data, total } = await this.onLoad(this.page, this.size);
          this.data = data || [];
          this.total = total;

          if (!data?.length) {
            this.isNoMoreData = true;
          }
        } catch (e) {
          this.hasError = true;
          console.log(e);
        }
        this.isRefreshLoading = false;
      }
    },

    async doLoad() {
      // console.log('doLoad', this.isLoading);
      if (!this.isLoading) {
        this.hasError = false;

        this.isMoreLoading = true;
        try {
          let { data, total } = await this.onLoad(this.page + 1, this.size);
          this.data.push(...(data || []));
          this.page++;
          this.total = total;

          if (!data?.length) {
            this.isNoMoreData = true;
          }
        } catch (e) {
          this.hasError = true;
          console.log(e);
        }
        this.isMoreLoading = false;
      }
    },

    cancelRefresh(e: boolean) {
      if (e === false) {
        console.log('cancelRefresh', e);
      }
    },
    cancelLoad(e: boolean) {
      if (e === false) {
        console.log('cancelLoad', e);
      }
    }
  },

  created() {
    this.doRefresh(true);
  }
});
</script>

<style lang="scss">
.h-loadmore {
  min-height: 100%;
  &__total {
    text-align: center;
    padding: 13px;
    color: #757575;
  }
  &__empty {
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 210px;
      pointer-events: none;
    }
    p {
      font-size: 14px;
      color: #dcdcdc;
      margin: 0;
    }
  }
}
</style>
