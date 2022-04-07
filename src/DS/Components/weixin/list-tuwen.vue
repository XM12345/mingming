<template>
  <h-loadmore ref="loadmore" :class="[B()]" :onLoad="onLoad">
    <template #list="{ data }">
      <div :class="[B('__list')]">
        <section v-for="item in data" :key="item.id" :class="[B('__item')]">
          <header>
            <time>{{ $F.time(item.lastEditTime || item.creationTime, '', '更新') }}</time>
            <mark>{{ statusName(item.status) }}</mark>
            <span @click="operate(item)"></span>
          </header>
          <footer>
            <h-link v-for="i in item.articles" :key="i.id" :to="`/weixin/${accountId}/content/${item.id}/${i.id}`">
              <p>{{ i.title }}</p>
              <img :src="i.thumbUrl" alt />
            </h-link>
          </footer>
        </section>
      </div>

      <h-popup
        v-model="isOperate"
        :class="[B('__operate')]"
        position="bottom"
        :overlayStyle="{ background: 'transparent', opacity: 0 }"
      >
        <footer>
          <span :class="`s-${item.key}`" v-for="item in operateAble" :key="item.key" @click="handle(item.key)">
            {{ item.name }}
          </span>
        </footer>
      </h-popup>
    </template>
  </h-loadmore>
</template>

<script lang="ts">
import Vue from 'vue';
enum EWeixinOperateAble {
  修改 = 1,
  审核 = 2,
  删除 = 3,
  恢复 = 4,
  撤销 = 5,
  批注 = 6,
  预览 = 7,
  群发 = 8,
  提交 = 9
}

export default Vue.extend({
  name: 'weixin--list-tuwen',
  props: {
    accountId: { required: true, type: Number, default: undefined },
    status: { type: Number, default: -1 },
    keyword: { type: String, default: '' }
  },
  data() {
    return {
      isOperate: false,
      operateAble: [] as { name: string; key: string }[],
      contentId: 0
    };
  },
  computed: {
    watchData(): { accountId: number | undefined; status: number; keyword: string } {
      return { accountId: this.accountId, status: this.status, keyword: this.keyword };
    }
  },
  watch: {
    watchData(cur, old) {
      (this.$refs['loadmore'] as any)?.doRefresh();
    }
  },
  created() {},
  methods: {
    onLoad(page: number, size: number) {
      return this.$Model.Weixin.contents(this.accountId, page, { status: this.status, keyword: this.keyword, size });
    },
    statusName(status: number) {
      return ['草稿', '一审', '二审', '三审', '', '', '', '', '', '待审', '通过', '入库', '已发布', '发布失败'][status];
    },
    operate(item: any) {
      this.isOperate = !this.isOperate;
      this.contentId = item.id;
      let { operateAble } = item;
      operateAble = Array.from(new Set(operateAble)); // 剔除重复
      this.operateAble = [{ name: '详情', key: 'content' }];
      operateAble.forEach((item: any, index: number) => {
        let eachIndex = operateAble[index];
        if (
          [
            EWeixinOperateAble.审核,
            EWeixinOperateAble.删除,
            EWeixinOperateAble.批注,
            EWeixinOperateAble.群发,
            EWeixinOperateAble.提交
          ].includes(eachIndex)
        ) {
          let name = ['编辑', '审核', '删除', '恢复', '撤销', '批注', '预览', '发布', '提交'][eachIndex - 1];
          let key = ['edit', 'audit_', 'delete', 'recover', 'revoke', 'comment', 'preview', 'publish', 'accept'][
            eachIndex - 1
          ];
          this.operateAble.push({ name, key });
        }
      });
    },
    handle(key: string) {
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
      this.$router.push(`/weixin/${this.accountId}/content/${this.contentId}`);
    },
    async del() {
      if (await this.$confirm('确定要删除吗？')) {
        await this.$Model.Weixin.delete(this.accountId, this.contentId);
        this.$toast('删除成功');
        (this.$refs['loadmore'] as any)?.doRefresh();
      }
    },
    publish() {
      this.$router.push(`/weixin/${this.accountId}/content/${this.contentId}/publish/now`);
    },
    // 提交群发图文
    async commit() {
      if (await this.$confirm('确定要提交吗？')) {
        await this.$Model.Weixin.commit(this.accountId, this.contentId);
        this.$toast('提交成功');
        this.isOperate = false;
        (this.$refs['loadmore'] as any)?.doRefresh();
      }
    }
  }
});
</script>

<style lang="scss">
.weixin--list-tuwen {
  position: relative;
  &__item {
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
  &__operate {
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
