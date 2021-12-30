<template>
  <div class="page-doc-add">
    <h-topbar title="添加文稿">
      <div v-if="isStartSearch">
        <input
          type="text"
          placeholder="请输入关键词"
          v-model.trim="keyword"
          @input="lazySearch"
          @keyup.enter="search"
          ref="input"
        />
        <mark @click="clear" v-if="keyword != ''">✕</mark>
      </div>
      <button class="h-topbar-search" @click="startSearch" v-else></button>
    </h-topbar>
    <div class="s-select">
      <base--selectbar :selectBar="selectBar" @select="select" v-if="selectBar.length"></base--selectbar>
    </div>
    <doc--list-docs
      :col="col"
      :quote="quote"
      :status="status"
      :keyword="name"
      :docIds="doc_ids"
      @doc-add-modify="modify"
    ></doc--list-docs>
    <footer class="s-footer-fixed" v-if="isShowBtn">
      <button class="s-cancel" @click="cancel">取消</button>
      <button class="s-confirm" @click="confirm">确定</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [],
      col: '',
      checkData: [],
      doc_ids: [],
      type: '',
      quote: -1,
      status: -1,
      quotes: [
        { name: '全部', value: 0 },
        { name: '未引用', value: 1 },
        { name: '已引用', value: 2 }
      ],
      keyword: '',
      message: '',
      name: '',
      isStartSearch: false,
      listStatus: [
        { name: '全部', value: -1 },
        { name: '草稿', value: 0 },
        { name: '待审', value: 9 },
        { name: '通过', value: 10 }
      ],
      selectBar: [],
      isShowBtn: true
    };
  },
  created() {
    let { doc_ids } = this.$route.params;
    let { type } = this.$route.query;
    this.doc_ids = (doc_ids && doc_ids.split(',').map(Number)) || [];
    this.type = type;
    this.getColumns();
  },
  mounted() {
    let originHeight = document.documentElement.clientHeight;
    window.onresize = () => {
      return (() => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          let showHeight = document.body.clientHeight;
          this.isShowBtn = !(showHeight < originHeight);
        } else {
          this.isShowBtn = true;
        }
      })();
    };
  },
  methods: {
    getColumns() {
      this.$Model.Doc.columns('series.add').then(data => {
        this.columns = data.filter(item => !item.parent_id);
        this.selectBar = [
          { type: 'column', returnWord: 'col', value: '', valueName: '所有栏目', list: this.columns },
          {
            type: 'normal',
            returnWord: 'status',
            value: -1,
            valueName: '所有状态',
            list: this.listStatus
          },
          { type: 'normal', returnWord: 'quote', value: 0, valueName: '引用标识', list: this.quotes }
        ];
      });
    },
    lazySearch() {
      clearTimeout(this._jobID);
      this._jobID = setTimeout(() => {
        this.search();
      }, 500);
    },
    startSearch() {
      this.isStartSearch = true;
    },
    search() {
      if (this.keyword) {
        this.message = '正在搜索...';
        setTimeout(() => {
          this.message = '';
        }, 1000);
        this.name = this.keyword;
      }
    },
    getTotal(total) {
      this.total = total;
      if (total) {
        this.isLoad = true;
      }
    },
    clear() {
      this.keyword = '';
      this.isStartSearch = false;
    },
    select(item) {
      switch (item.type) {
        case 'col':
          this.col = item.id;
          break;
        case 'quote':
          this.quote = item.value;
          break;
        case 'status':
          this.status = item.value;
          break;
        default:
          break;
      }
    },
    modify(data) {
      this.checkData = data;
    },
    cancel() {
      this.$router.back();
    },
    confirm() {
      if (this.type == 'insert') {
        this.$root.$emit('doc-insert-doc', this.checkData);
      } else {
        this.$root.$emit('doc-add-doc', this.checkData);
      }
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.page-doc-add {
  padding-bottom: 65px;
  .h-topbar header {
    & > div {
      position: absolute;
      margin: 0 40px;
      top: 0;
      right: 0;
      left: 0;
      background: #fff;
      input {
        height: 38px;
        width: 100%;
        padding: 0;
        font-size: 15px;
        background: transparent;

        border: none;
        outline: none;
        &::placeholder {
          color: #999;
        }
      }
      mark {
        position: absolute;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: #fff;
        color: #999;
      }
    }
  }
  .s-select {
    height: 51px;
    .h-selectbar {
      position: fixed;
      width: 100%;
      top: 41px;
      background-color: #f9f9f9;
      z-index: 999;
    }
  }
  .s-footer-fixed {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    padding: 0 13px;
    button {
      width: 46%;
      font-size: 15px;
      padding: 11px 10px;
      border: 1px solid transparent;
      &.s-cancel {
        color: #666;
        border: 1px solid #eaeaea;
        background: #fff;
      }
      &.s-confirm {
        float: right;
        color: #fff;
        background: #1890ff;
      }
    }
  }
}
</style>
