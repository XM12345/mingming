<template>
  <div class="page-doc-user-add">
    <base--topbar :title="type_name"> </base--topbar>
    <div class="s-select">
      <base--selectbar
      :selectBar="selectBar"
        @select="select"
        v-if="selectBar.length"
      ></base--selectbar>
    </div>
    <mt-loadmore
      :bottomMethod="loadNext"
      :topMethod="loadFirst"
      :bottomAllLoaded="allLoaded"
      :autoFill="false"
      ref="loadmore"
    >
    <ul class="s-users">
      <li v-for="(item, index) in contents" :key="item.id" @click="check(item, index)">
          <base--img :imgUrl="item.avatar_url" alt /></base--img>
          <span>{{ item.nickname || item.username }}</span>
        <label role="checkbox" :class="{ isChecked: item.isChecked == true }"></label>
      </li>
    </ul>
    </mt-loadmore>
      <footer class="s-footer">
        <div class="mint-accounts">
        <base--img :imgUrl="item.avatar_url" v-for="item in CheckedData" :key="item.id" alt /></base--img>
      </div>
      <button class="mint-operate-button" @click="publish">确定</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allLoaded:false,
      page:1,
      type_name: '',
      columns: [],
      allStatus: [],
      dept: '',
      contents: [],
      CheckedData: [],
      user_ids: [],
      selectBar:[]
    };
  },
  created() {
    let { type_name,user_ids } = this.$route.params;
    this.type_name = type_name;
    this.user_ids = (user_ids && user_ids.split(',').map(Number)) || [];
    this.getDepts();
    this.loadFirst();
  },
  watch: {
    dept(cur, old) {
      this.loadFirst();
    }
  },
  methods: {
    getDepts() {
      this.$Model.Doc.depts().then(data => {
        this.columns = data;
        this.columns.unshift({ id: '', name: '所有部门' });
         this.selectBar = [
          { type: 'normal', returnWord: 'dept', value: '', valueName: '所有部门', list: this.columns },
        ];
      });
    },
    loadFirst() {
      this.allLoaded = false;
      this.page = 1;
      let { dept } = this;
      this.$Model.Doc.users(this.page, { dept }).then(
        data => {
          this.contents = data.data.map(item => {
          item.isChecked = !!this.user_ids.includes(item.id);
          return item;
        });
        if (!dept) {
          this.CheckedData = this.contents.filter(item => item.isChecked == true);
        }
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
      let { dept } = this;
      this.$Model.Doc.users(this.page, { dept }).then(
        data => {
          this.contents.push(...data.data.map(item => {
          item.isChecked = !!this.user_ids.includes(item.id);
          return item;
        }));
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
    select(item) {
      this.dept = item.id;
    },
    check(item, index) {
      this.contents[index].isChecked = !this.contents[index].isChecked;
      if (item.isChecked) {
        this.CheckedData.push(item);
      } else {
        let cancelIndex = this.CheckedData.findIndex(i => i.id == item.id);
        this.CheckedData.splice(cancelIndex, 1);
      }
      this.user_ids = this.CheckedData.map(item => item.id);
    },
    publish() {
      this.$root.$emit('doc-add-user',this.CheckedData);
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.page-doc-user-add {
  .header-dropdown {
    max-height: 30vh !important;
  }
  .s-users {
    padding-bottom: 50px;
    li {
       position:relative;
      margin: 0 13px;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      padding-right: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
      img {
        display:inline-block;
        width: 36px;
        min-width: 36px;
    height: 36px;
    margin-right:10px;
    background: #eee;
    border-radius: 50%;
    vertical-align: middle;
      }
      span {
        font-size: 15px;
    color: #343434;
    vertical-align: middle;
      }
         label {
          position: absolute;
          top: 50%;
          right: 0;
          border-radius: 50%;
          border: 1px solid #666;
          padding: 5px;
          margin: 0 10px;
          transform: translateY(-50%);
          &.isChecked {
            background: url('../weixin/_images/checked@2x.png');
            background-repeat: no-repeat;
            background-size: 100%;
            border: none;
            padding: 6px;
          }
        }
    }
  }
  .s-footer {
    position:fixed;
    bottom:0;
    height:48px;
    width: 100%;
    background:#f9f9f9;
     .mint-accounts {
      display: flex;
      white-space: nowrap;
      overflow-x: auto;
      margin-right: 70px;
      img {
        display: block;
        width: 36px;
        min-width: 36px;
        height: 36px;
        margin: 5px;
        padding: 1px;
        background-color: #eee;
        border-radius:50%;
      }
    }
    .mint-operate-button {
      position: absolute;
      right: 0;
      bottom: 0;
      background: #1890ff;
      color: #fff;
      font-size: 15px;
      border: none;
      padding: 14px 18px;
    }
  }
}
</style>
