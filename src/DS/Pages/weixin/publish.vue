<template>
  <div :class="[B()]">
    <h-topbar title="发布到"></h-topbar>

    <div :class="[B('__main')]">
      <ul :class="[B('__list')]">
        <li v-for="(item, index) in contents" :key="item.id" :class="[B('__item')]" @click="check(item, index)">
          <p>
            <img :src="item.avatarUrl || defaultUrl" alt />
            <span>{{ item.name }}</span>
          </p>
          <label role="checkbox" :class="{ isChecked: item.isChecked == true }"></label>
        </li>
      </ul>
    </div>

    <h-popup
      v-model="isOperate"
      :class="[B('__operate')]"
      position="bottom"
      :overlayStyle="{ background: 'transparent', opacity: 0 }"
    >
      <div :class="[B('__operate_accounts')]">
        <img v-for="item in CheckedData" :key="item.id" :src="item.avatarUrl || defaultUrl" alt />
      </div>
      <button :class="[B('__operate_confirm')]" @click="publish">确定</button>
    </h-popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weixin-publish',
  data() {
    return {
      accountsIds: [] as number[],
      contents: [] as any[],
      CheckedData: [] as any[],
      defaultUrl: require('./_images/picture@2x.png'),
      isOperate: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$Model.Weixin.accounts().then(data => {
        data.map((item: any) => {
          item.isChecked = false;
          return item;
        });
        this.contents = data;
      });
    },
    check(item: any, index: number) {
      this.contents[index].isChecked = !this.contents[index].isChecked;
      let CheckedData = this.contents.filter(item => item.isChecked == true);
      this.CheckedData = CheckedData;
      this.accountsIds = CheckedData.map(item => item.id);
      if (this.isOperate == false || !CheckedData.length) {
        this.isOperate = !this.isOperate;
      }
    },
    publish() {
      let { account_id, content_id } = this.$route.params;
      let data = { accounts: this.accountsIds, send_time: 0 };
      this.$Model.Weixin.publish(account_id, content_id, data).then(() => {
        this.isOperate = false;
        this.contents.map(item => {
          item.isChecked = false;
        });
        this.$toast('发布成功');
      });
    }
  }
});
</script>

<style lang="scss">
.page-weixin-publish {
  min-height: 100%;
  background-color: #f4f6f9;
  &__item {
    position: relative;
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;
    background-color: #fff;
    p {
      margin: 0;
      padding-right: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      img {
        display: inline-block;
        width: 36px;
        height: 36px;
        vertical-align: middle;
        background-color: #eee;
      }
      span {
        font-size: 15px;
        color: #333;
        vertical-align: middle;
        padding-left: 10px;
      }
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
        background: url('./_images/checked@2x.png');
        background-repeat: no-repeat;
        background-size: 100%;
        border: none;
        padding: 6px;
      }
    }
  }
  &__operate {
    width: 100%;
    background: #fff;
    &_accounts {
      display: flex;
      white-space: nowrap;
      overflow-x: auto;
      margin-right: 70px;
      img {
        display: block;
        width: 36px;
        height: 36px;
        margin: 5px;
        padding: 1px;
        background-color: #eee;
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
