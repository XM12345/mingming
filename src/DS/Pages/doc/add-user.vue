<template>
  <div :class="[B()]">
    <h-topbar :title="title"></h-topbar>

    <ul :class="[B('__list')]">
      <li v-for="(item, index) in contents" :key="item.id" :class="[B('__item')]" @click="check(item, index)">
        <span>{{ item.nickname }}</span>
        <label role="checkbox" :class="{ isChecked: item.isChecked === true }"></label>
      </li>
    </ul>

    <footer :class="[B('__footer')]">
      <div :class="[B('__footer_checked')]">
        <span v-for="item in CheckedData" :key="item.id">{{ item.nickname }}</span>
      </div>
      <button :class="[B('__footer_confirm')]" @click="publish">确定</button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-doc-user-add',
  data() {
    return {
      title: '',
      colId: 0,
      contents: [] as any[],
      CheckedData: [] as any[],
      userIds: [] as number[]
    };
  },
  created() {
    let { col_id, type_name, user_ids } = this.$route.params;
    this.colId = Number(col_id) || 0;
    this.title = type_name;
    this.userIds = (user_ids && user_ids.split(',').map(Number)) || [];

    this.init();
  },
  methods: {
    init() {
      this.$Model.Doc.colUsers(this.colId).then(data => {
        this.contents = data.map((item: any) => {
          item.isChecked = !!this.userIds.includes(item.id);
          return item;
        });
        this.CheckedData = this.contents.filter((item: any) => item.isChecked === true);
      });
    },
    check(item: any, index: number) {
      this.contents[index].isChecked = !this.contents[index].isChecked;
      if (item.isChecked) {
        this.CheckedData.push(item);
      } else {
        let cancelIndex = this.CheckedData.findIndex(i => i.id == item.id);
        this.CheckedData.splice(cancelIndex, 1);
      }
      this.userIds = this.CheckedData.map(item => item.id);
    },
    publish() {
      this.$root.$emit('doc-add-user', this.CheckedData);
      this.$router.back();
    }
  }
});
</script>

<style lang="scss">
.page-doc-user-add {
  &__list {
    padding-bottom: 50px !important;
  }
  &__item {
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
  &__footer {
    position: fixed;
    bottom: 0;
    height: 48px;
    width: 100%;
    background: #f9f9f9;
    &_checked {
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
    &_confirm {
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
