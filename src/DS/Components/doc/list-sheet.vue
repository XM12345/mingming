<template>
  <div class="doc--list-sheet">
    <section class="item" v-for="item in contents" :key="item.key" @click="view(item)">
      <div>
        <p>{{ item.title }}</p>
        <span>{{ item.creator_nickname || item.creator_username }} | {{ duration(item.text_duration) }}</span>
      </div>
      <mark :class="className(item.status)">{{ item.status_name }}</mark>
    </section>
    <a class="s-spread" v-if="items.length > 3" @click="spread">
      {{ isSpread ? '收起' : `查看全部文稿 (${items.length})` }}
      <mark :class="{ active: isSpread }"></mark>
    </a>
    <h-popup class="s-popup-view" v-model="isView">
      <div>
        <h1>
          {{ pre_item.title }}
        </h1>
        <p>{{ pre_item.content }}</p>
      </div>
    </h-popup>
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
      pre_item: {},
      isSpread: false,
      isView: false
    };
  },

  created() {
    this.contents = this.items.slice(0, 3);
  },
  methods: {
    className(status) {
      let data = status == 0 ? 'no_start' : status == 10 ? 'success' : 'fail';
      return data;
    },
    duration(duration) {
      if (duration > 0) {
        let h = (((duration / 60 / 60) | 0) + '').padStart(2, '0');
        let m = (((duration / 60) % 60 | 0) + '').padStart(2, '0');
        let s = ((duration % 60) + '').padStart(2, '0');
        return h + ':' + m + ':' + s;
      } else {
        return '00:00:00';
      }
    },
    spread() {
      this.isSpread = !this.isSpread;
      if (this.isSpread) {
        this.contents = this.items;
      } else {
        this.contents = this.items.slice(0, 3);
      }
    },
    view(item) {
      // type: 1-文稿,2-预设项
      let { type, id } = item;
      if (type == 1) {
        this.$toPage('doc', id);
      }
      if (type == 2) {
        this.$Model.Doc.items(id).then(data => {
          this.isView = true;
          this.pre_item = data;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.doc--list-sheet {
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
  .s-popup-view {
    width: 80%;
    border-radius: 4px;
    div {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ddd;
      h1 {
        font-weight: 400;
        font-size: 15px;
        color: #606266;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
        padding: 0 15px;
      }
      p {
        padding: 15px;
        min-height: 80px;
        max-height: 45vw;
        overflow-y: auto;
        margin: 0;
        color: #606266;
        font-size: 13px;
      }
    }
  }
}
</style>
