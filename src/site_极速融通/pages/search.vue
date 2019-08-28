<template>
  <div class="page-search">
    <h-topbar>
      <div>
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
    </h-topbar>
    <div class="s-main">
      <p class="s-main-message" v-if="message">{{message}}</p>
      <p class="s-main-nodata" v-if="name && !searchList.length"></p>
      <doc--list-series :name="name" :isLoad="isLoad" @data="list"></doc--list-series>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyword: '',
      _jobID: undefined,
      searchList: [],
      message: '',
      name: '',
      isLoad: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input && this.$refs.input.focus();
    });
  },
  methods: {
    lazySearch() {
      clearTimeout(this._jobID);
      this._jobID = setTimeout(() => {
        this.search();
      }, 500);
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
    list(value) {
      if (value) {
        this.searchList = value;
        this.isLoad = true;
      }
    },
    clear() {
      this.keyword = '';
    }
  }
};
</script>
<style lang="scss">
.page-search {
  position: relative;
  height: 100%;
  background-color: #f4f6f9;
  .h-topbar {
    div {
      position: relative;
      margin: 0 40px;
      input {
        height: 38px;
        width: 100%;
        font-size: 15px;

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
  .s-main {
    height: calc(100% - 41px);
    position: relative;
    &-message {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin: 5px 0;
    }
    &-nodata {
      background: url('../images/detail/noSearch@2x.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 210px;
      height: 100%;
      margin: 0;
    }
  }
}
</style>


