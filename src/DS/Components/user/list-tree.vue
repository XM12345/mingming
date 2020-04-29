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
      let { activeKey } = this;
      switch (activeKey) {
        case 'doc':
        case 'series':
          let pk = activeKey == 'series' ? 'series.view' : 'doc.view';
          this.$Model.Doc.getColumns(activeKey, pk).then(data => {
            this.contents = data.filter(item => !item.parent_id);
          });
          break;
        case 'subject':
          this.$Model.Subject.getColumns().then(data => {
            this.contents = data.filter(item => !item.parent_id);
          });
          break;
        case 'clue':
          this.$Model.Clue.tree().then(data => {
            this.contents = data;
          });
          break;
        case 'media':
          this.$Model.Media.getColumns().then(data => {
            this.contents = data.filter(item => !item.parent_id);
          });
          break;
        case 'stream':
          this.$Model.Stream.getColumns().then(data => {
            this.contents = data.filter(item => !item.parent_id);
          });
          break;
        default:
          break;
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
