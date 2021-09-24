<template>
  <h-loadmore :class="[B()]" :onLoad="onLoad" ref="loadmore">
    <template #list="{ data }">
      <div class="s-list">
        <base--link :to="`/weibo/articles/${item.id}`" class="item" v-for="item in data" :key="item.id">
          <section>
            <div>
              <p>{{ item.title }}</p>
              <span>{{ item.edit_time || item.creation_time | ds_time('', '更新') }}</span>
            </div>
          </section>
          <footer>
            <span class="s-view">{{ item.view_count }}</span>
            <label></label>
            <span class="s-forward">{{ item.forward_count }}</span>
            <label></label>
            <span class="s-lun">{{ item.comment_count }}</span>
            <!-- 1-审核中，2-已通过，3-已发布 -->
            <mark :class="item.state | filter_class">{{ item.state | filter_state }}</mark>
          </footer>
        </base--link>
      </div>
    </template>
  </h-loadmore>
</template>

<script>
export default {
  name: 'weibo--list-article',
  props: {
    account: {
      default: undefined
    },
    state: {
      default: ''
    },
    searchkey: {
      default: ''
    }
  },
  data() {
    return {
      allLoaded: false,
      page: 1,
      contents: []
    };
  },
  created() {},
  filters: {
    filter_state(state) {
      return ['审核中', '已通过', '已发布'][state - 1] || '未知';
    },
    filter_class(state) {
      return ['pending', 'pass', 'success'][state - 1];
    }
  },
  computed: {
    watchData() {
      let { account, state, searchkey } = this;
      return { account, state, searchkey };
    }
  },
  watch: {
    watchData(cur, old) {
      this.$refs['loadmore']?.doRefresh();
    }
  },
  methods: {
    onLoad(page, size) {
      return this.$Model.Weibo.articles(page, {
        account: this.account,
        state: this.state,
        searchkey: this.searchkey,
        size
      });
    }
  }
};
</script>

<style lang="scss">
.weibo--list-article {
  position: relative;

  .s-list {
    .item {
      display: block;
      background-color: #fff;
      border-bottom: 8px solid #f4f6f9;

      section {
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
      footer {
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
        @each $img in view, forward, lun {
          span.s-#{$img} {
            background-image: url('./_images/#{$img}@2x.png');
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
}
</style>
