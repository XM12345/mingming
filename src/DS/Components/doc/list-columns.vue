<template>
  <div class="doc--list-columns">
    <div v-for="(item,index) in tree" :key="item.id">
      <p>
        <span
          @click="(item.children.length && item.type==2) ? isShowItem(item,index) : select(item)"
        >{{item.name}}</span>
        <mark
          @click="isShowItem(item,index)"
          :class="{active: item.isFolder==false}"
          v-if="item.children.length"
        ></mark>
      </p>
      <doc--list-columns
        :class="{folder:item.isFolder == true}"
        :tree="item.children"
        @select="select"
        v-if="item.children.length"
      ></doc--list-columns>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tree: {
      default: () => []
    }
  },
  methods: {
    isShowItem(item, index) {
      // type:1-普通栏目，2-标题栏目
      this.tree[index].isFolder = !this.tree[index].isFolder;
    },
    select(item) {
      this.$emit('select', item);
    }
  }
};
</script>

<style lang="scss">
.doc--list-columns {
  display: block;
  &.folder {
    display: none;
    animation: hide 4.5s;
  }
  @keyframes hide {
    0% {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
    100% {
      opacity: 1;
    }
  }
  div {
    padding-left: 10px;
    p {
      position: relative;
      font-size: 15px;
      color: #333;
      mark {
        display: inline-block;
        margin-left: 5px;
        border: 5px solid;
        background: none;
        border-color: #999 transparent transparent;
        transition: all 0.5s;
        &.active {
          transform: rotate(180deg) translate(0px, 3px);
          border-color: #1890ff transparent transparent;
        }
      }
    }
  }
}
</style>

