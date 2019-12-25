<template>
  <div class="weixin-publish">
    <base--topbar title="发布到"></base--topbar>
    <div class="weixin-publish-main">
      <ul>
        <li v-for="(item,index) in contents" :key="item.id" @click="check(item, index)">
          <p>
            <img :src="item.avatarUrl || defaultUrl" />
            <span>{{item.name}}</span>
          </p>
          <label role="checkbox" :class="{isChecked:item.isChecked==true}"></label>
        </li>
      </ul>
    </div>
    <mt-popup class="mint-popup-operate" v-model="isOperate" position="bottom">
      <div class="mint-accounts">
        <img :src="item.avatarUrl || defaultUrl" v-for="item in CheckedData" :key="item.id" />
      </div>
      <button class="mint-operate-button" @click="publish">确定</button>
    </mt-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contents: [],
      CheckedData: [],
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
        data.map(item => {
          item.isChecked = false;
          return item;
        });
        this.contents = data;
      });
    },
    check(item, index) {
      this.contents[index].isChecked = !this.contents[index].isChecked;
      let CheckedData = this.contents.filter(item => item.isChecked == true);
      this.CheckedData = CheckedData;
      this.accounts_ids = CheckedData.map(item => item.id);
      if (this.isOperate == false || !CheckedData.length) {
        this.isOperate = !this.isOperate;
      }
    },
    publish() {
      let { params } = this.$route;
      let { account_id, content_id } = params;
      let data = { accounts: this.accounts_ids, send_time: 0 };
      this.$Model.Weixin.publish(account_id, content_id, data).then(() => {
        this.isOperate = false;
        this.contents.map(item => {
          item.isChecked = false;
        });
        this.$toast('发布成功');
      });
    }
  }
};
</script>

<style lang="scss">
.weixin-publish {
  height: 100%;
  background-color: #f4f6f9;
  &-main {
    ul {
      li {
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
            width: 36px;
            height: 36px;
            vertical-align: middle;
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
    }
  }
  .v-modal {
    display: none;
  }
  .mint-popup-operate {
    width: 100%;
    background: #fff;
    .mint-accounts {
      display: flex;
      white-space: nowrap;
      overflow-x: auto;
      margin-right: 70px;
      img {
        display: block;
        width: 36px;
        height: 36px;
        padding: 7px;
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
