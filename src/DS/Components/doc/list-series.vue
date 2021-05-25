<template>
  <mt-loadmore
    class="doc--list-series"
    :bottomMethod="loadNext"
    :topMethod="loadFirst"
    :bottomAllLoaded="allLoaded"
    :autoFill="false"
    ref="loadmore"
  >
    <div class="s-list">
      <router-link class="item" :to="`/series/${item.id}`" v-for="item in seriesList" :key="item.id">
        <section>
          <div>
            <p>{{ item.title }}</p>
            <span>{{ item.col_name }}</span>
            <span v-if="activeKey != 'mine'">{{ item.creator_nickname || item.creator_username }}</span>
            <!-- 回收站按照删除时间排序，其他按照最新编辑时间排序 -->
            <span v-if="item.delete_time">{{ item.delete_time | ds_time('', '删除') }}</span>
            <span v-else>{{ item.edit_time || item.creation_time | ds_time('', '更新') }}</span>
          </div>
          <!-- <mark></mark> -->
        </section>
        <footer>
          <span>通过文稿/总文稿: {{ item.doc_progress }}</span>
          <mark v-if="item.status_name">{{ item.status_name }}</mark>
        </footer>
      </router-link>
    </div>
  </mt-loadmore>
</template>

<script>
export default {
  props: {
    col: {
      default: undefined
    },
    status: {
      default: -1
    },
    activeKey: {
      default: 'list'
    },
    isLoad: {
      default: true
    },
    name: {
      default: undefined
    }
  },
  data() {
    return {
      allLoaded: false,
      page: 1,
      seriesList: []
    };
  },
  created() {
    if (this.isLoad == true) {
      this.loadFirst();
    }
  },
  computed: {
    watchData() {
      let { col, status, activeKey, name } = this;
      return { col, status, activeKey, name };
    }
  },
  watch: {
    watchData(cur, old) {
      this.loadFirst();
    }
  },
  methods: {
    loadFirst() {
      this.allLoaded = false;
      this.page = 1;
      let { col, status, activeKey, name } = this;
      let Model;
      if (activeKey == 'mine') {
        Model = this.$Model.Doc.seriesMine(this.page, { col, status, name });
      } else if (activeKey == 'list') {
        Model = this.$Model.Doc.seriesList(this.page, { col, status, name });
      } else if (activeKey == 'audit') {
        Model = this.$Model.Doc.audit(this.page, { col, status, name });
      } else if (activeKey == 'recycle') {
        Model = this.$Model.Doc.recycle(this.page, { col, status, name });
      }
      Model.then(
        data => {
          this.seriesList = data.data;
          this.$emit('total', data.total);
          this.page++;
          this.$refs.loadmore.onTopLoaded();
        },
        e => {
          this.$refs.loadmore.onTopLoaded();
        }
      );
    },
    loadNext() {
      let { col, status, activeKey, name } = this;
      let Model;
      if (activeKey == 'mine') {
        Model = this.$Model.Doc.seriesMine(this.page, { col, status, name });
      } else if (activeKey == 'list') {
        Model = this.$Model.Doc.seriesList(this.page, { col, status, name });
      } else if (activeKey == 'audit') {
        Model = this.$Model.Doc.audit(this.page, { col, status, name });
      } else if (activeKey == 'recycle') {
        Model = this.$Model.Doc.recycle(this.page, { col, status, name });
      }
      Model.then(
        data => {
          this.seriesList.push(...data.data);
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
.doc--list-series {
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
            padding-right: 10px;
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

        span {
          font-size: 12px;
          color: #999;
        }
        mark {
          float: right;
          font-size: 12px;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
