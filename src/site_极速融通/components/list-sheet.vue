<template>
  <div class="list-sheet">
    <router-link class="item" :to="`/docs/${item.id}`" v-for="item in contents" :key="item.key">
      <div>
        <p>{{item.title}}</p>
        <span>{{item.creator_nickname || item.creator_username}} | {{item.text_duration | filter_duration}}</span>
      </div>
      <mark :class="item.status | filter_class">{{item.status | filter_status}}</mark>
    </router-link>
    <a class="s-spread" v-if="items.length > 3" @click="spread">
      {{isSpread ? '收起': `查看全部文稿 (${items.length})`}}
      <mark :class="{active:isSpread}"></mark>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      contents: [],
      isSpread: false
    };
  },
  filters: {
    filter_status(status) {
      return status == 0 ? '草稿' : status == 9 ? '待审' : status == 10 ? '通过' : '其它';
    },
    filter_class(status) {
      let data = status == 0 ? 'no_start' : status == 10 ? 'success' : status == 9 ? 'fail' : '';
      return data;
    },
    filter_duration(duration) {
      if (duration > 0) {
        let h = (((duration / 60 / 60) | 0) + '').padStart(2,'0');
        let m = (((duration / 60) % 60 | 0) + '').padStart(2,'0');
        let s = (duration % 60 + '').padStart(2,'0');
        return h + ':' + m + ':' + s;
      } else {
        return '00:00:00';
      }
    }
  },
  created() {
    this.contents = this.items.slice(0, 3);
  },
  methods: {
    spread() {
      this.isSpread = !this.isSpread;
      if (this.isSpread) {
        this.contents = this.items;
      } else {
        this.contents = this.items.slice(0, 3);
      }
    }
  }
};
</script>


<style lang="scss">
.list-sheet {
  background-color: #fff;
  .item {
    position: relative;
    display: block;
    padding: 15px 0;
    margin: 0 15px;
    border-bottom: 1px solid #f1f1f1;

    div {
      max-width: 85%;

      p {
        margin: 0;
        padding-bottom: 10px;
        font-size: 15px;
        color: #333;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      span {
        font-size: 12px;
        color: #999;
      }
    }
    mark {
      background: none;
      position: absolute;
      right: 15px;
      bottom: 15px;
      font-size: 12px;

      &.no_start {
        color: #999;
      }
      &.success {
        color: #44c288;
      }
      &.fail {
        color: #f64d65;
      }
    }
  }
  .s-spread {
    position: relative;
    display: block;
    text-align: center;
    color: #999;
    font-size: 12px;
    padding: 10px;

    mark {
      display: inline-block;
      background: transparent;
      border: 1px solid #999;
      border-top: none;
      border-left: none;
      height: 10px;
      width: 10px;
      transform: rotate(45deg) translate(0, -5px);
      transform-origin: bottom;
      transition: all 0.5s;
      &.active {
        transform: rotate(-135deg) translate(-2px, 8px);
      }
    }
  }
}
</style>
