<template>
  <h-loadmore ref="loadmore" :class="[B()]" :onLoad="onLoad">
    <template #list="{ data }">
      <ul>
        <doc--list-docs-item
          v-for="(item, index) in data"
          :key="index"
          :item="item"
          @check="check(item)"
        ></doc--list-docs-item>
      </ul>
    </template>
  </h-loadmore>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'doc--list-docs',
  props: {
    col: { type: Number, default: undefined },
    quote: { type: Number, default: 0 },
    status: { type: Number, default: -1 },
    keyword: { type: String, default: '' },
    docIds: { type: Array, default: () => [] }
  },
  data() {
    return {
      contents: [] as any[]
    };
  },
  computed: {
    watchData(): { col: number | undefined; status: number; quote: number; keyword: string } {
      return { col: this.col, status: this.status, quote: this.quote, keyword: this.keyword };
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
      return this.$Model.Doc.seriesDocs(page, {
        status: this.status,
        col: this.col,
        quote: this.quote,
        keyword: this.keyword,
        size
      }).then(async result => {
        let { data } = result;
        result.data = data.map((item: any) => ({ ...item, isChecked: false, timeStamp: 0 }));
        return result;
      });
    },

    check(item: any) {
      item.isChecked = !item.isChecked;
      if (!item.isChecked) {
        let index = this.contents.findIndex(({ id }) => id == item.id);
        this.contents.splice(index, 1);
      } else {
        this.contents.push(item);
      }
      item.timeStamp = Date.now();
      let CheckedData = this.contents.filter((item: any) => item.isChecked === true);
      CheckedData.sort((a: any, b: any) => a.timeStamp - b.timeStamp);
      this.$emit('doc-add-modify', CheckedData);
    }
  }
});
</script>
