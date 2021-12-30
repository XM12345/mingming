<template>
  <div class="page-doc-user-add">
    <h-topbar :title="type_name"></h-topbar>
    <ul class="s-users">
      <li v-for="(item, index) in contents" :key="item.id" @click="check(item, index)">
        <span>{{ item.nickname }}</span>
        <label role="checkbox" :class="{ isChecked: item.isChecked == true }"></label>
      </li>
    </ul>
    <footer class="s-footer">
      <div class="mint-accounts">
        <span v-for="item in CheckedData" :key="item.id">{{ item.nickname }}</span>
      </div>
      <button class="mint-operate-button" @click="publish">确定</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type_name: '',
      columns: [],
      col_id: 0,
      allStatus: [],
      dept: '',
      contents: [],
      CheckedData: [],
      user_ids: [],
      selectBar: []
    };
  },
  created() {
    let { col_id, type_name, user_ids } = this.$route.params;
    this.col_id = col_id;
    this.type_name = type_name;
    this.user_ids = (user_ids && user_ids.split(',').map(Number)) || [];

    this.init();
  },
  methods: {
    init() {
      this.$Model.Doc.colUsers(this.col_id).then(data => {
        this.contents = data.map(item => {
          item.isChecked = !!this.user_ids.includes(item.id);
          return item;
        });
        this.CheckedData = this.contents.filter(item => item.isChecked == true);
      });
    },
    getDepts() {
      this.$Model.Doc.depts().then(data => {
        this.columns = data;
        this.columns.unshift({ id: '', name: '所有部门' });
        this.selectBar = [{ type: 'normal', returnWord: 'dept', value: '', valueName: '所有部门', list: this.columns }];
      });
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
      this.$root.$emit('doc-add-user', this.CheckedData);
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
    padding-bottom: 50px !important;
    li {
      position: relative;
      margin: 0 13px;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      padding-right: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      img {
        display: inline-block;
        width: 36px;
        min-width: 36px;
        height: 36px;
        margin-right: 10px;
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
    position: fixed;
    bottom: 0;
    height: 48px;
    width: 100%;
    background: #f9f9f9;
    .mint-accounts {
      display: flex;
      white-space: nowrap;
      align-items: center;
      height: 100%;
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
        border-radius: 50%;
      }
      span {
        margin: 0 5px;
        font-size: 14px;
        color: #666;
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
