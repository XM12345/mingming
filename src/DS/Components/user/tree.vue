<template>
  <div class="message-item">
    <div v-for="(item, index) in tree" :key="item.id">
      <p>
        <span @click="isShowItem(item, index)">{{ item.name }}</span>
        <mark :class="{ active: item.isFolder == false }" v-if="item.children.length"></mark>
        <!-- type:1-普通栏目，2-标题栏目 -->
        <label
          class="select"
          role="checkbox"
          :class="{ isChecked: item.is_follow == true }"
          @click="select(item, index)"
          :id="item.id"
          v-if="item.type != 2 && item.column_type != 2"
        ></label>
      </p>
      <user--tree
        :class="{ folder: item.isFolder == true }"
        :tree="item.children"
        :ackey="ackey"
        v-if="item.children.length"
      ></user--tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tree: {
      default: () => []
    },
    ackey: {
      default: ''
    }
  },
  data() {
    return {
      isopen: true
    };
  },
  watch: {
    ackey() {}
  },
  methods: {
    isShowItem(item, index) {
      this.tree[index].isFolder = !this.tree[index].isFolder;
    },
    select(item, index) {
      let { ackey } = this;
      // doc,series,subject
      this.tree[index].is_follow = !this.tree[index].is_follow;
      let data = {
        type: 1,
        is_follow: this.tree[index].is_follow
      };
      // 'clue', 'media', 'stream'
      let checked = document.querySelectorAll('.isChecked');
      let checked_ids = [];
      checked.forEach(item => {
        checked_ids.push(parseInt(item.id));
      });
      if (this.tree[index].is_follow == true) {
        checked_ids.push(item.id);
      } else {
        let cancel_index = checked_ids.findIndex(i => i == item.id);
        checked_ids.splice(cancel_index, 1);
      }
      switch (ackey) {
        case 'doc':
        case 'series':
          this.$Model.Doc.postFollow(item.id, ackey, data).then(() => {});
          break;
        case 'subject':
          this.$Model.Subject.postFollow(item.id, data).then(() => {});
          break;
        case 'clue':
          this.$Model.Clue.postFollow(checked_ids).then(() => {});
          break;
        case 'media':
          checked_ids = checked_ids.length ? checked_ids : 0;
          this.$Model.Media.attention(checked_ids.toString()).then(() => {});
          break;
        case 'stream':
          checked_ids = checked_ids.length ? checked_ids : 0;
          this.$Model.Stream.putColumns(checked_ids.toString()).then(() => {});
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.message-item {
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
      label {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        &.isChecked {
          background: url('./_images/checked@2x.png');
          background-repeat: no-repeat;
          background-size: 100%;
          border: none !important;
          padding: 6px !important;
        }
        &.select {
          margin: 0 10px;
          padding: 5px;
          border-radius: 50%;
          border: 1px solid #999;
        }
      }
    }
  }
}
</style>
