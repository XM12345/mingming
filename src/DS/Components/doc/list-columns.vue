<template>
  <div :class="[B()]">
    <div v-for="(item, index) in tree" :key="item.id">
      <p>
        <span @click="spread(item, index)">{{ item.name }}</span>
        <mark
          v-if="item.children.length"
          @click="isShowItem(item, index)"
          :class="{ active: item.isFolder === false }"
        ></mark>
      </p>
      <doc--list-columns
        v-if="item.children.length"
        :class="{ folder: item.isFolder === true }"
        :tree="item.children"
        @select="select"
      ></doc--list-columns>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
enum EDocColumnType {
  普通栏目 = 1,
  标题栏目 = 2
}

export default Vue.extend({
  name: 'doc--list-columns',
  props: {
    tree: { type: Array as PropType<any[]>, default: () => [] }
  },
  data() {
    return {};
  },
  methods: {
    isShowItem(item: any, index: number) {
      this.tree[index].isFolder = !this.tree[index].isFolder;
    },
    select(item: any) {
      this.$emit('select', item);
    },
    spread(item: any, index: number) {
      if (item.children.length && item.type === EDocColumnType.标题栏目) {
        this.isShowItem(item, index);
      } else {
        this.select(item);
      }
    }
  }
});
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
