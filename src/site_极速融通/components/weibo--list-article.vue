<template>
  <div class="weibo--list-article">
    <p class="s-contents-nodata" v-if="!contents.length"></p>
    <mt-loadmore
      :bottomMethod="loadNext"
      :topMethod="loadFirst"
      :bottomAllLoaded="allLoaded"
      :autoFill="false"
      ref="loadmore"
    >
      <div class="s-list">
        <router-link
          :to="`/weibo/articles/${item.id}`"
          class="item"
          v-for="item in contents"
          :key="item.id"
        >
          <section>
            <div>
              <p>{{item.title}}</p>
              <span>{{item.creation_time | ds_time('yyyy-MM-dd hh:mm')}}</span>
            </div>
            <!-- <mark></mark> -->
          </section>
          <footer>
            <span class="s-view">{{item.view_count}}</span>
            <label></label>
            <span class="s-forward">{{item.forward_count}}</span>
            <label></label>
            <span class="s-lun">{{item.comment_count}}</span>
            <!-- 1-审核中，2-已通过，3-已发布 -->
            <mark :class="item.state | filter_class">{{item.state | filter_state}}</mark>
          </footer>
        </router-link>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
export default {
  props: {
    account: {
      default: undefined
    },
    state: {
      default: ''
    },
    isLoad: {
      default: true
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
  created() {
    if (this.isLoad == true) {
      this.loadFirst();
    }
  },
  filters: {
    filter_state(state) {
      return ['审核中', '已通过', '已发布'][state - 1] || '未知';
    },
    filter_class(state) {
      return ['pending', 'pass', 'success'][state - 1];
    }
  },
  watch: {
    account() {
      this.loadFirst();
    },
    state() {
      this.loadFirst();
    },
    searchkey() {
      if (this.searchkey) {
        this.loadFirst();
      }
    }
  },
  methods: {
    loadFirst() {
      this.allLoaded = false;
      this.page = 1;
      let { account, state, searchkey } = this;
      this.$Model.Weibo.articles(this.page, { account, state, searchkey }).then(
        data => {
          this.contents = data.data;
          this.$emit('data', this.contents);
          this.page++;
          this.$refs.loadmore.onTopLoaded();
        },
        e => {
          this.$refs.loadmore.onTopLoaded();
        }
      );
    },
    loadNext() {
      let { account, state, searchkey } = this;
      this.$Model.Weibo.articles(this.page, { account, state, searchkey }).then(
        data => {
          this.contents.push(...data.data);
          this.$emit('data', this.contents);
          this.page++;
          if (!data.data.length) {
            this.$toast('没有更多内容了');
            this.allLoaded = true;
          }
          this.$refs.loadmore.onBottomLoaded();
        },
        e => {
          this.$refs.loadmore.onBottomLoaded();
        }
      );
    }
  }
};
</script>

<style lang="scss">
.weibo--list-article {
  position: relative;
  height: 100%;
  .s-contents-nodata {
    background: url('../images/detail/noContent@2x.png');
    height: 100%;
    margin: 0;
    background-repeat: no-repeat;
    background-size: 210px;
    background-position: center;
  }
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
            background-image: url('../images/detail/#{$img}@2x.png');
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
