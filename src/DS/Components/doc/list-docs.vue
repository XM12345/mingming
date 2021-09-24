<template>
  <h-loadmore :class="[B()]" :onLoad="onLoad" ref="loadmore">
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

<script>
export default {
  name: 'doc--list-docs',
  props: {
    col: {
      default: ''
    },
    quote: {
      default: 0
    },
    status: {
      default: -1
    },
    keyword: {
      default: ''
    },
    docIds: {
      default: () => []
    }
  },
  data() {
    return {
      contents: []
    };
  },
  created() {},
  computed: {
    watchData() {
      let { col, status, quote, keyword } = this;
      return { col, status, quote, keyword };
    }
  },
  watch: {
    watchData(cur, old) {
      this.$refs['loadmore']?.doRefresh();
    }
  },
  methods: {
    onLoad(page, size) {
      return this.$Model.Doc.seriesDocs(page, {
        status: this.status,
        col: this.col,
        quote: this.quote,
        keyword: this.keyword,
        size
      }).then(async result => {
        let { data } = result;
        result.data = data.map(item => ({ ...item, isChecked: false, timeStamp: 0 }));
        return result;
      });
    },

    check(item) {
      item.isChecked = !item.isChecked;
      if (!item.isChecked) {
        let index = this.contents.findIndex(({ id }) => id == item.id);
        this.contents.splice(index, 1);
      } else {
        this.contents.push(item);
      }
      item.timeStamp = Date.now();
      let CheckedData = this.contents.filter(item => item.isChecked == true);
      CheckedData.sort((a, b) => a.timeStamp - b.timeStamp);
      this.$emit('doc-add-modify', CheckedData);
    }
  }
};
</script>
