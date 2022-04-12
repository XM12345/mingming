<template>
  <div :class="[B()]">
    <user--tree v-if="contents.length" :ackey="activeKey" :tree="contents"></user--tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'user--list-tree',
  props: {
    activeKey: { type: String, default: '' }
  },
  data() {
    return {
      contents: [] as any[]
    };
  },
  watch: {
    activeKey() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let { activeKey } = this;
      switch (activeKey) {
        case 'doc':
        case 'series':
          let pk = activeKey == 'series' ? 'series.view' : 'doc.view';
          this.$Model.Doc.getColumns(activeKey, pk).then(data => {
            this.contents = data.filter((item: any) => !item.parent_id);
          });
          break;
        case 'subject':
          this.$Model.Subject.getColumns().then(data => {
            this.contents = data.filter((item: any) => !item.parent_id);
          });
          break;
        case 'clue':
          this.$Model.Clue.tree().then(data => {
            this.contents = data;
          });
          break;
        case 'media':
          this.$Model.Media.getColumns().then(data => {
            this.contents = data.filter((item: any) => !item.parent_id);
          });
          break;
        case 'stream':
          this.$Model.Stream.getColumns().then(data => {
            this.contents = data.filter((item: any) => !item.parent_id);
          });
          break;
        default:
          break;
      }
    }
  }
});
</script>

<style lang="scss">
.user--list-tree {
  padding: 0 10px;
}
</style>
