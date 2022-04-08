<template>
  <h-loadmore ref="loadmore" :class="[B()]" :onLoad="onLoad">
    <template #list="{ data }">
      <div :class="[B('__list')]">
        <h-link v-for="item in data" :key="item.id" :class="[B('__item')]" :to="`/docs/series/${item.id}`">
          <section>
            <div>
              <p>{{ item.title }}</p>
              <span>{{ item.col_name }}</span>
              <span v-if="activeKey !== 'mine'">{{ item.creator_nickname || item.creator_username }}</span>
              <!-- 回收站按照删除时间排序，其他按照最新编辑时间排序 -->
              <span v-if="item.delete_time">{{ $F.time(item.delete_time, '', '删除') }}</span>
              <span v-else>{{ $F.time(item.edit_time || item.creation_time, '', '更新') }}</span>
            </div>
          </section>
          <footer>
            <span>通过文稿/总文稿: {{ item.doc_progress }}</span>
            <mark v-if="item.status_name">{{ item.status_name }}</mark>
          </footer>
        </h-link>
      </div>
    </template>
  </h-loadmore>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'doc--list-series',
  props: {
    col: { type: Number, default: undefined },
    status: { type: Number, default: -1 },
    activeKey: { type: String, default: 'list' },
    name: { type: String, default: undefined }
  },
  data() {
    return {};
  },
  computed: {
    watchData(): { col: number | undefined; status: number; activeKey: string; name: string | undefined } {
      return { col: this.col, status: this.status, activeKey: this.activeKey, name: this.name };
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
      let { activeKey, col, status, name } = this;
      if (activeKey === 'mine') {
        return this.$Model.Doc.seriesMine(page, { col, status, name, size });
      } else if (activeKey === 'list') {
        return this.$Model.Doc.seriesList(page, { col, status, name, size });
      } else if (activeKey === 'audit') {
        return this.$Model.Doc.audit(page, { col, status, name, size });
      } else if (activeKey === 'recycle') {
        return this.$Model.Doc.recycle(page, { col, status, name, size });
      }
    }
  }
});
</script>

<style lang="scss">
.doc--list-series {
  &__item {
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
</style>
