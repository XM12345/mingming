<template>
  <mt-loadmore
    class="doc--list-docs"
    :bottomMethod="loadNext"
    :topMethod="loadFirst"
    :bottomAllLoaded="allLoaded"
    :autoFill="false"
    ref="loadmore"
  >
    <ul>
      <doc--list-docs-item
        v-for="(item, index) in contents"
        :key="index"
        :item="item"
        @check="check(item, index)"
      ></doc--list-docs-item>
    </ul>
  </mt-loadmore>
</template>

<script>
export default {
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
      allLoaded: false,
      page: 1,
      contents: []
    };
  },
  created() {
    this.loadFirst();
  },
  computed: {
    watchData() {
      let { col, status, quote, keyword } = this;
      return { col, quote };
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
      let { status, col, quote, keyword } = this;
      this.$Model.Doc.seriesDocs(this.page, { status, col, quote, keyword }).then(
        data => {
          this.contents = data.data.map(item => {
            //item.isChecked = !!this.docIds.includes(item.id);
            item.isChecked = false;
            item.timeStamp = 0;
            return item;
          });
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
      let { status, col, quote, keyword } = this;
      this.$Model.Doc.seriesDocs(this.page, { status, col, quote, keyword }).then(
        data => {
          this.contents.push(
            ...data.data.map(item => {
              //item.isChecked = !!this.docIds.includes(item.id);
              item.isChecked = false;
              item.timeStamp = 0;
              return item;
            })
          );
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
    },
    check(item, index) {
      this.contents[index].isChecked = !this.contents[index].isChecked;
      item.timeStamp = Date.now();
      let CheckedData = this.contents.filter(item => item.isChecked == true);
      CheckedData.sort((a, b) => a.timeStamp - b.timeStamp);
      this.$emit('doc-add-modify', CheckedData);
    }
  }
};
</script>
