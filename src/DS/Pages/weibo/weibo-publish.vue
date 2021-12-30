<template>
  <div class="weibo-publish">
    <h-topbar title="发布到"></h-topbar>
    <div class="weibo-publish-main">
      <ul>
        <li v-for="(item, index) in contents" :key="item.id" @click="check(item, index)">
          <p>
            <span>{{ item.name }}</span>
          </p>
          <label role="checkbox" :class="{ isChecked: item.isChecked == true }"></label>
        </li>
      </ul>
    </div>
    <h-popup
      class="s-popup-operate"
      v-model="isOperate"
      position="bottom"
      :overlayStyle="{ background: 'transparent', opacity: 0 }"
    >
      <div class="s-accounts">
        <span v-for="item in CheckedData" :key="item.id">{{ item.name }}</span>
      </div>
      <button class="s-operate-button" @click="push">确定</button>
    </h-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article_id: undefined,
      accounts_ids: [],
      contents: [],
      CheckedData: [],
      isOperate: false,
      push_id: undefined
    };
  },
  created() {
    let { params } = this.$route;
    let { article_id } = params;
    this.article_id = article_id;
    this.init();
  },
  methods: {
    init() {
      let operation = 'article_push';
      this.$Model.Weibo.accounts(operation).then(data => {
        data.map(item => {
          item.isChecked = false;
          return item;
        });
        this.contents = data;
      });
    },
    authorise(account_id) {
      // 公众号授权（无需传授权码，接口返回授权地址，后台可缓存七天）
      this.$Model.Weibo.authorise(account_id).then(data => {
        window.location.href = data;
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
    push() {
      let data = { account_ids: this.accounts_ids };
      this.$Model.Weibo.push(this.article_id, data).then(
        () => {
          this.isOperate = false;
          this.contents.map(item => {
            item.isChecked = false;
          });
          this.$toast('发布成功');
        },
        e => {
          let { error, message } = e;
          if (error == 30002) {
            let match = message.match(/【.+】/)[0];
            let name = match.replace('【', '').replace('】', '');
            let account_data = this.CheckedData.find(item => item.name == name);
            let { id } = account_data;
            if (id) {
              this.authorise(id);
              // window.location.href = 'http://www.baidu.com';
            }
          }
        }
      );
    }
  }
};
</script>
<style lang="scss">
.weibo-publish {
  min-height: 100%;
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
  .s-popup-operate {
    width: 100%;
    background: #fff;
    .s-accounts {
      display: flex;
      white-space: nowrap;
      overflow-x: auto;
      margin-right: 70px;
      height: 48px;
      line-height: 48px;
      span {
        padding: 0 5px;
        font-size: 13px;
      }
    }
    .s-operate-button {
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
