<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">操作纪录</h3>
    <div v-for="item in logs" :key="item.id" :class="[B('__item')]">
      <h-user :src="item.operator_avatar_url"></h-user>
      <div>
        <p>{{ item.operator_nickname }}</p>
        <span>{{ item.title || item.description || item.type }}</span>
      </div>
      <time>{{ $F.time(item.operate_time) }}</time>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'doc--list-logs',
  props: {
    docId: { required: true, type: Number, default: 0 }
  },
  data() {
    return {
      logs: [] as any[]
    };
  },
  created() {
    this.init();
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshLogs = this.init;
    }
  },
  methods: {
    async init() {
      this.logs = await this.$Model.Doc.operlog(this.docId);
    }
  }
});
</script>

<style lang="scss">
.doc--list-logs {
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
