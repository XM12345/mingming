<template>
  <footer class="h-footer">
    <span
      :class="[`s-${item.key}`, activeKey == item.key ? 'active' : '']"
      v-for="item in footerNavs"
      :key="item.key"
      @click="switchTo(item.key)"
    >{{item.name}}</span>
  </footer>
</template>
<script>
export default {
  props: {
    footerNavs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeKey: ''
    };
  },
  created() {
    this.activeKey = this.$route.query['key'] || this.footerNavs[0].key;
  },
  methods: {
    switchTo(key) {
      this.activeKey = key;
      this.$emit('switchTo', key);
      history.replaceState(null, 'key', `/#/series?key=${key}`);
    }
  }
};
</script>


<style lang="scss">
.h-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  text-align: center;
  padding: 5px 0;
  background-color: #fff;
  //box-shadow: 0 0 5px #eee;
  border-top: 1px solid #efefef;
  span {
    flex-grow: 1;
    font-size: 12px;
    background-repeat: no-repeat;
    background-size: 25px;
    background-position: center top;
    padding-top: 28px;
    color: #949799;
    &.active {
      color: #1890ff;
    }
  }
  @each $img in mine, list, audit, recycle {
    span.s-#{$img} {
      background-image: url('../../Pages/doc/_images/#{$img}@2x.png');
      &.active {
        background-image: url('../../Pages/doc/_images/#{$img}-active@2x.png');
      }
    }
  }
}
</style>
