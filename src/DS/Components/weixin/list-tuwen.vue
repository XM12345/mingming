<template>
  <h-loadmore :class="[B()]" :onLoad="onLoad" ref="loadmore">
    <template #list="{ data }">
      <h-popup
        class="s-popup-operate"
        v-model="isOperate"
        position="bottom"
        :overlayStyle="{ background: 'transparent', opacity: 0 }"
      >
        <footer>
          <span :class="`s-${item.key}`" v-for="item in operate_able" :key="item.key" @click="handle(item.key)">{{
            item.name
          }}</span>
        </footer>
      </h-popup>
      <div class="s-list">
        <section v-for="item in data" :key="item.id">
          <header>
            <time>{{ $F.time(item.lastEditTime || item.creationTime, '', '更新') }}</time>
            <!-- 0-草稿，1-一审，2-二审，3-三审，9-待审，10-通过，11-入库，12-已发布，13-发布失败 -->
            <mark>{{ statusName(item.status) }}</mark>
            <span @click="operate(item)"></span>
          </header>
          <footer>
            <base--link :to="`/weixin/${accountId}/content/${item.id}/${i.id}`" v-for="i in item.articles" :key="i.id">
              <p>{{ i.title }}</p>
              <img :src="i.thumbUrl" alt />
            </base--link>
          </footer>
        </section>
      </div>
    </template>
  </h-loadmore>
</template>

<script>
export default {
  name: 'weixin--list-tuwen',
  props: {
    accountId: {
      required: true,
      default: undefined
    },
    status: {
      default: -1
    },
    keyword: {
      default: ''
    }
  },
  data() {
    return {
      isOperate: false,
      operate_able: [],
      oper_id: undefined
    };
  },
  created() {},
  computed: {
    watchData() {
      let { accountId, status, keyword } = this;
      return { accountId, status, keyword };
    }
  },
  watch: {
    watchData(cur, old) {
      this.$refs['loadmore']?.doRefresh();
    }
  },
  methods: {
    onLoad(page, size) {
      return this.$Model.Weixin.contents(this.accountId, page, { status: this.status, keyword: this.keyword, size });
    },
    statusName(status) {
      return ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过', '入库', '已发布', '发布失败'][status];
    },

    operate(item) {
      this.isOperate = !this.isOperate;
      this.oper_id = item.id;
      let { operateAble } = item;
      operateAble = Array.from(new Set(operateAble)); // 剔除重复
      // 1-修改，2-审核，3-删除，4-恢复，5-撤销，6-批注，7-预览，8-群发, 9-提交
      this.operate_able = [{ name: '详情', key: 'content' }];
      operateAble.forEach((item, index) => {
        let eachIndex = operateAble[index];
        if ([2, 3, 6, 8, 9].includes(eachIndex)) {
          let name = ['编辑', '审核', '删除', '恢复', '撤销', '批注', '预览', '发布', '提交'][eachIndex - 1];
          let key = ['edit', 'audit_', 'delete', 'recover', 'revoke', 'comment', 'preview', 'publish', 'accept'][
            eachIndex - 1
          ];
          this.operate_able.push({ name, key });
        }
      });
    },
    handle(key) {
      if (['content', 'comment', 'audit_'].includes(key)) {
        this.content();
      } else if (key == 'delete') {
        this.isOperate = false;
        this.del();
      } else if (key == 'publish') {
        this.publish();
      } else if (key == 'accept') {
        this.isOperate = false;
        this.commit();
      }
    },
    content() {
      let { accountId, oper_id } = this;
      this.$router.push(`/weixin/${accountId}/content/${oper_id}`);
    },
    async del() {
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Weixin.delete(this.accountId, this.oper_id);
        this.$toast('删除成功');
        this.$refs['loadmore']?.doRefresh();
      }
    },
    publish() {
      let { accountId, oper_id } = this;
      this.$router.push(`/weixin/${accountId}/content/${oper_id}/publish/now`);
    },
    async commit() {
      // 提交群发图文
      if (await this.$confirm('确定要提交吗？')) {
        await this.$Model.Weixin.commit(this.accountId, this.oper_id);
        this.$toast('提交成功');
        this.isOperate = false;
        this.$refs['loadmore']?.doRefresh();
      }
    }
  }
};
</script>

<style lang="scss">
.weixin--list-tuwen {
  position: relative;
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
          background-image: url('./_images/clock@2x.png');
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
          background-image: url('./_images/more@2x.png');
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
            background-color: #eee;
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
  .s-popup-operate {
    min-height: 70px;
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
      @each $img in audit_, revoke, delete, comment, publish, accept {
        span.s-#{$img} {
          background-image: url('../../Pages/doc/_images/#{$img}@2x.png');
        }
      }
      .s-content {
        background-image: url('./_images/content@2x.png');
      }
    }
  }
}
</style>
