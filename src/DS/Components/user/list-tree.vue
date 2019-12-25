<template>
  <div class="tree">
    <user--tree :ackey="activeKey" :tree="contents" v-if="contents.length"></user--tree>
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
      if (activeKey == 'doc' || activeKey == 'series') {
        let pk = 'doc.view';
        if (activeKey == 'series') {
          pk = 'series.view';
        }
        this.$Model.Doc.getColumns(activeKey, pk).then(data => {
          this.contents = data.filter(item => !item.parent_id);
        });
      } else if (activeKey == 'subject') {
        this.$Model.Subject.getColumns().then(data => {
          this.contents = data.filter(item => !item.parent_id);
        });
      } else if (activeKey == 'clue') {
        this.$Model.Clue.tree().then(data => {
          this.contents = data;
        });
      } else if (activeKey == 'media') {
        this.$Model.Media.getColumns().then(data => {
          this.contents = data.filter(item => !item.parent_id);
        });
      } else if (activeKey == 'stream') {
        this.$Model.Stream.getColumns().then(data => {
          this.contents = data.filter(item => !item.parent_id);
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
