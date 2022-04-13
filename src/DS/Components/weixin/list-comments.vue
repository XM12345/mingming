<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">批注</h3>
    <div v-show="item.body" v-for="item in comments" :key="item.id" :class="[B('__item')]">
      <h-user :src="item.avatarUrl"></h-user>
      <div>
        <p>
          {{ item.creatorNickname || item.creatorUsername }}
          <mark v-if="item.statusName">[{{ item.statusName }}]</mark>
        </p>
        <span>{{ item.body }}</span>
      </div>
      <time>{{ $F.time(item.creationTime) }}</time>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'weixin--list-comments',
  props: {
    contentId: { required: true, type: Number, default: 0 },
    accountId: { required: true, type: Number, default: 0 }
  },
  data() {
    return {
      comments: [] as any[]
    };
  },
  created() {
    this.init();
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshComment = this.init;
    }
  },
  methods: {
    async init() {
      this.comments = await this.$Model.Weixin.comments(this.accountId, this.contentId);
    }
  }
});
</script>

<style lang="scss">
.weixin--list-comments {
  background-color: #fff;
  border-bottom: 10px solid #f4f6f9;
  &__title {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  &__item {
    font-size: 12px;
    position: relative;
    padding: 15px;

    img {
      float: left;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #eee;
      vertical-align: middle;
    }
    div {
      vertical-align: middle;
      padding-left: 50px;

      p {
        min-height: 21px;
        margin: 0;
        padding-bottom: 5px;
        padding-right: 60px;
        color: #999;

        mark {
          background-color: #fff;
          color: inherit;
          padding-left: 30px;
        }
      }

      span {
        display: block;
        word-break: break-word;
        color: #333;
      }
    }
    time {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #999;
    }
  }
}
</style>
