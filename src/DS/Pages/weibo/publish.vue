<template>
  <div :class="[B()]">
    <h-topbar title="发布到"></h-topbar>
    <div :class="[B('__main')]">
      <ul :class="[B('__list')]">
        <li v-for="(item, index) in contents" :key="item.id" @click="check(item, index)">
          <p>
            <span>{{ item.name }}</span>
          </p>
          <label role="checkbox" :class="{ isChecked: item.isChecked === true }"></label>
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
        <span v-for="item in CheckedData" :key="item.id">{{ item.name }}</span>
      </div>
      <button :class="[B('__operate_confirm')]" @click="push">确定</button>
    </h-popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'page-weibo-publish',
  data() {
    return {
      articleId: 0,
      accountsIds: [] as number[],
      contents: [] as any[],
      CheckedData: [] as any[],
      isOperate: false
    };
  },
  created() {
    let { article_id } = this.$route.params;
    this.articleId = Number(article_id) || 0;
    this.init();
  },
  methods: {
    init() {
      let operation = 'article_push';
      this.$Model.Weibo.accounts(operation).then(data => {
        data.map((item: any) => {
          item.isChecked = false;
          return item;
        });
        this.contents = data;
      });
    },
    authorise(account_id: number) {
      // 公众号授权（无需传授权码，接口返回授权地址，后台可缓存七天）
      this.$Model.Weibo.authorise(account_id).then(data => {
        window.location.href = data;
      });
    },
    check(item: any, index: number) {
      this.contents[index].isChecked = !this.contents[index].isChecked;
      let CheckedData = this.contents.filter(item => item.isChecked === true);
      this.CheckedData = CheckedData;
      this.accountsIds = CheckedData.map(item => item.id);
      if (this.isOperate === false || !CheckedData.length) {
        this.isOperate = !this.isOperate;
      }
    },
    push() {
      let data = { account_ids: this.accountsIds };
      this.$Model.Weibo.push(this.articleId, data).then(
        () => {
          this.isOperate = false;
          this.contents.map(item => {
            item.isChecked = false;
          });
          this.$toast('发布成功');
        },
        e => {
          let { error, message } = e;
          if (error === 30002) {
            let match = message.match(/【.+】/)[0];
            let name = match.replace('【', '').replace('】', '');
            let account_data = this.CheckedData.find(item => item.name === name);
            let { id } = account_data;
            if (id) {
              this.authorise(id);
            }
          }
        }
      );
    }
  }
});
</script>

<style lang="scss">
.page-weibo-publish {
  min-height: 100%;
  background-color: #f4f6f9;
  &__list {
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
  .v-modal {
    display: none;
  }
  &__operate {
    width: 100%;
    background: #fff;
    &_accounts {
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
