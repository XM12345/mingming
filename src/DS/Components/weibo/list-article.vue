<template>
  <h-loadmore ref="loadmore" :class="[B()]" :onLoad="onLoad">
    <template #list="{ data }">
      <div :class="[B('__list')]">
        <h-link v-for="item in data" :key="item.id" :class="[B('__item')]" :to="`/weibo/articles/${item.id}`">
          <section :class="[B('__item_content')]">
            <div>
              <p>{{ item.title }}</p>
              <span>{{ $F.time(item.edit_time || item.creation_time, '', '更新') }}</span>
            </div>
          </section>
          <footer :class="[B('__item_count')]">
            <span :class="[B('__item_count_view')]">{{ item.view_count }}</span>
            <label></label>
            <span :class="[B('__item_count_forward')]">{{ item.forward_count }}</span>
            <label></label>
            <span :class="[B('__item_count_comment')]">{{ item.comment_count }}</span>
            <mark :class="className(item.state)">{{ stateName(item.state) }}</mark>
          </footer>
        </h-link>
      </div>
    </template>
  </h-loadmore>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'weibo--list-article',
  props: {
    account: { type: Number, default: undefined },
    state: { type: Number, default: undefined },
    searchkey: { type: String, default: '' }
  },
  data() {
    return {
      allLoaded: false,
      page: 1
    };
  },
  computed: {
    watchData() {
      return { account: this.account, state: this.state, searchkey: this.searchkey };
    }
  },
  watch: {
    watchData(cur, old) {
      (this.$refs['loadmore'] as any)?.doRefresh();
    }
  },
  created() {},
  methods: {
    onLoad(page: number, size: number) {
      return this.$Model.Weibo.articles(page, {
        account: this.account,
        state: this.state,
        searchkey: this.searchkey,
        size
      });
    },
    stateName(state: number) {
      return ['审核中', '已通过', '已发布'][state - 1] || '未知';
    },
    className(state: number) {
      return ['pending', 'pass', 'success'][state - 1];
    }
  }
});
</script>

<style lang="scss">
.weibo--list-article {
  position: relative;

  &__item {
    display: block;
    background-color: #fff;
    border-bottom: 8px solid #f4f6f9;

    &_content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #eaeaea;

      div {
        overflow: hidden;

        p {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 15px;
          color: #333;
          margin: 0;
          margin-bottom: 5px;
        }
        span {
          color: #999;
          font-size: 12px;
        }
      }
      mark {
        background: none;
        min-width: 11px;
        width: 11px;
        height: 11px;
        border: 1px solid #ddd;
        border-radius: 50%;
        margin-left: 10px;
      }
    }
    &_count {
      padding: 11px 15px;
      color: #999;
      font-size: 12px;
      span {
        background-size: 16px;
        background-repeat: no-repeat;
        background-position: left center;
        padding-left: 20px;
      }
      label {
        display: inline-block;
        height: 11px;
        width: 1.5px;
        background: #999;
        vertical-align: middle;
        margin: 0 10px;
      }
      @each $img in view, forward, comment {
        &_#{$img} {
          background-image: url('./_images/icon-#{$img}.png');
        }
      }
      mark {
        float: right;
        color: #999;
        background-color: #fff;
        &.success {
          color: #1890ff;
        }
        &.pass {
          color: #44c288;
        }
      }
    }
  }
}
</style>
