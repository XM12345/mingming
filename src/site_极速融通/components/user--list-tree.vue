<template>
  <div class="tree">
    <h-tree :ackey="activeKey" :tree="contents" v-if="contents.length"></h-tree>
  </div>
</template>

<script>
export default {
  props: {
    activeKey: {
      default: ''
    }
  },
  data() {
    return {
      contents: []
    };
  },
  created() {
    this.init();
  },
  watch: {
    activeKey() {
      this.init();
    }
  },
  methods: {
    init() {
      let Model;
      let { activeKey } = this;
      if (activeKey == 'doc') {
        this.$Model.Doc.getColumns().then(data => {
          this.contents = data.filter(item => !item.parent_id || item.parent_id == 0);
        });
      } else if (activeKey == 'subject') {
        this.$Model.Subject.getColumns().then(data => {
          this.contents = data.filter(item => !item.parent_id || item.parent_id == 0);
        });
      } else if (activeKey == 'clue') {
        this.$Model.Clue.tree().then(data => {
          this.contents = data;
        });
      } else if (activeKey == 'media') {
        this.$Model.Media.getColumns().then(data => {
          this.contents = data.filter(item => !item.parent_id || item.parent_id == 0);
        });
      }
    }
  }
};
</script>

<style lang="scss">
.tree {
  padding: 0 10px;
  h3 {
    position: relative;
    color: #333;
    font-size: 15px;
    font-weight: normal;
    padding-left: 10px;
    label {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      display: inline-block;
      background: transparent;
      border: 1px solid #999;
      border-top: none;
      border-left: none;
      height: 9px;
      width: 9px;
      margin: 0 18px;
      margin-top: -4px;
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
