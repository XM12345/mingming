<template>
  <div class="weixin--list-tuwen">
    <p class="s-contents-nodata" v-if="!contents.length"></p>
    <mt-loadmore
      :bottomMethod="loadNext"
      :topMethod="loadFirst"
      :bottomAllLoaded="allLoaded"
      :autoFill="false"
      ref="loadmore"
    >
      <div class="s-list">
        <section v-for="item in contents" :key="item.id">
          <header>
            <time>{{item.lastEditTime | ds_time('yyyy-MM-dd hh:mm')}}</time>
            <!-- 0-草稿，1-一审，2-二审，3-三审，9-待审，10-通过，11-入库，12-已发布，13-发布失败 -->
            <mark>{{item.status | filter_status}}</mark>
            <span @click="operate(item)"></span>
          </header>
          <footer>
            <router-link
              :to="`/weixin/${accountId}/content/${item.id}/${i.id}`"
              v-for="i in item.articles"
              :key="i.id"
            >
              <p>{{i.title}}</p>
              <img :src="i.thumbUrl" />
            </router-link>
          </footer>
        </section>
      </div>
      <mt-popup class="mint-popup-operate" v-model="isOperate" position="bottom">
        <footer>
          <span
            :class="`s-${item.key}`"
            v-for="item in operate_able"
            :key="item.key"
            @click="handle(item.key)"
          >{{item.name}}</span>
        </footer>
      </mt-popup>
      <mt-popup class="mint-popup-delete" v-model="isDelete" position="center">
        <div class="s-de">
          <p>提示</p>
          <p class="s-de-info">是否确定删除此图文？</p>
          <div>
            <button class="s-de-cancel" @click="cancel">取消</button>
            <button class="s-de-confirm" @click="del">删除</button>
          </div>
        </div>
      </mt-popup>
    </mt-loadmore>
  </div>
</template>

<script>
export default {
  props: {
    accountId: {
      required: true,
      default: undefined
    },
    status: {
      default: -1
    },
    isLoad: {
      default: true
    },
    keyword: {
      default: ''
    }
  },
  data() {
    return {
      allLoaded: false,
      page: 1,
      contents: [],
      isDelete: false,
      isOperate: false,
      operate_able: [],
      oper_id: undefined
    };
  },
  created() {
    if (this.isLoad == true) {
      this.loadFirst();
    }
  },
  filters: {
    filter_status(status) {
      return (
        ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过', '入库', '已发布', '发布失败'][status] ||
        '未知'
      );
    }
  },
  watch: {
    accountId() {
      this.loadFirst();
    },
    status() {
      this.loadFirst();
    },
    keyword() {
      if (this.keyword) {
        this.loadFirst();
      }
    }
  },
  methods: {
    loadFirst() {
      this.allLoaded = false;
      this.page = 1;
      let { status, keyword } = this;
      this.$Model.Weixin.contents(this.accountId, this.page, { status, keyword }).then(
        data => {
          this.contents = data.data;
          this.$emit('data', this.contents);
          this.page++;
          this.$refs.loadmore.onTopLoaded();
        },
        e => {
          this.$refs.loadmore.onTopLoaded();
        }
      );
    },
    loadNext() {
      let { status, keyword } = this;
      this.$Model.Weixin.contents(this.accountId, this.page, { status, keyword }).then(
        data => {
          this.contents.push(...data.data);
          this.$emit('data', this.contents);
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
    operate(item) {
      this.isOperate = !this.isOperate;
      this.oper_id = item.id;
      let { operateAble } = item;
      // 1-修改，2-审核，3-删除，4-恢复，5-撤销，6-批注，7-预览，8-群发, 9-提交
      this.operate_able = [{ name: '详情', key: 'content' }];
      operateAble.forEach((item, index) => {
        if (operateAble[index] == 2) {
          this.operate_able.push({ name: '审核', key: 'audit_' });
        } else if (operateAble[index] == 3) {
          this.operate_able.push({ name: '删除', key: 'delete' });
        } else if (operateAble[index] == 8) {
          this.operate_able.push({ name: '发布', key: 'publish' });
        } else if (operateAble[index] == 6) {
          this.operate_able.push({ name: '批注', key: 'comment' });
        } else if (operateAble[index] == 9) {
          this.operate_able.push({ name: '提交', key: 'accept' });
        }
      });
    },
    handle(key) {
      if (key == 'content' || key == 'comment' || key == 'audit_') {
        this.content();
      } else if (key == 'delete') {
        this.isDelete = true;
      } else if (key == 'publish') {
        this.publish();
      } else if (key == 'accept') {
        this.commit();
      }
    },
    content() {
      let { accountId, oper_id } = this;
      this.$router.push(`/weixin/${accountId}/content/${oper_id}`);
    },
    del() {
      let { accountId, oper_id } = this;
      this.$Model.Weixin.delete(accountId, oper_id).then(() => {
        this.isDelete = false;
        this.$toast('删除成功');
        this.loadFirst();
      });
    },
    cancel() {
      this.isDelete = false;
    },
    publish() {
      let { accountId, oper_id } = this;
      this.$router.push(`/weixin/${accountId}/content/${oper_id}/publish/now`);
    },
    commit() {
      // 提交群发图文
      let { accountId, oper_id } = this;
      this.$Model.Weixin.commit(accountId, oper_id).then(() => {
        this.$toast('提交成功');
        this.isOperate = false;
        this.loadFirst();
      });
    }
  }
};
</script>


<style lang="scss">
.weixin--list-tuwen {
  position: relative;
  height: 100%;
  .s-list {
    section {
      background-color: #fff;
      margin-bottom: 10px;

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        time {
          background-image: url('../images/detail/clock@2x.png');
          background-repeat: no-repeat;
          background-size: 12px;
          font-size: 13px;
          background-position: left center;
          padding-left: 20px;
          line-height: 21px;
          color: #999;
        }
        mark {
          font-size: 13px;
          color: #1890ff;
          background: none;
          border: 1px solid #1890ff;
          padding: 1px 10px;
          border-radius: 3px;
        }
        span {
          background-image: url('../images/detail/more@2x.png');
          background-repeat: no-repeat;
          /* background-size: 12px; */
          display: inline-block;
          width: 22px;
          height: 20px;
          background-size: 100% 100%;
          background-position: center center;
        }
      }
      footer {
        padding: 10px 15px;
        a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          font-size: 15px;
          color: #333;
          padding: 5px 0;
          border-bottom: 1px solid #eaeaea;
          &:last-child {
            border-bottom: none;
          }
          p {
            flex-grow: 1;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            padding: 0 10px;
          }
          img {
            width: 52px;
            height: 52px;
            margin-left: 10px;
            min-width: 52px;
          }
          &:first-child {
            position: relative;
            padding: 0;
            img {
              display: block;
              width: 100%;
              height: 34vw;
              margin: 0;
            }
            p {
              display: block;
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              margin: 0;
              padding: 5px 10px;
              background-color: rgba(0, 0, 0, 0.3);
              text-shadow: 0 0 2px #000;
              font-size: 15px;
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .v-modal {
    opacity: 0;
    background: #fff;
  }
  .mint-popup-operate {
    min-height: 50px;
    width: 100%;
    background: #fff;

    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      text-align: center;
      padding: 8px 0;
      background-color: #fff;
      border-top: 1px solid #efefef;
      span {
        flex-grow: 1;
        font-size: 12px;
        background-repeat: no-repeat;
        background-size: 35px;
        background-position: center top;
        padding-top: 38px;
      }
      @each $img in audit_, revoke, delete, comment, content, publish, accept {
        span.s-#{$img} {
          background-image: url('../images/detail/#{$img}@2x.png');
        }
      }
    }
  }
  .mint-popup-delete {
    width: 75vw;
    box-shadow: 1px 1px 50px #ccc;
    border-radius: 5px;
    .s-de {
      p,
      div {
        text-align: center;
        color: #333;
        font-size: 14px;
      }
      &-info {
        margin: 32px 0;
      }
      div {
        border-top: 1px solid #eee;
        button {
          width: 50%;
          padding: 10px 0;
          border: none;
          background: none;
        }
      }
      &-cancel {
        border-right: 1px solid #eee !important;
      }
      &-confirm {
        color: #1890ff;
      }
    }
  }
}
</style>

