<template>
  <div class="list-notice">
    <router-link
      :to="`/notices/${item.id}`"
      v-for="item in contents"
      :key="item.id"
      :class="{'readed':item.has_read}"
      @click.native="item.has_read = true"
    >
      <div>
        <label v-if="!item.has_read"></label>
        <p>{{item.title}}</p>
        <span>{{item.author_nickname || item.author_name}} | {{parseInt(item.creation_time) | ds_time}}</span>
      </div>
      <mark></mark>
    </router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      contents: []
    };
  },
  created() {
    this.$Model.General.notices().then(data => {
      this.contents = data;
    });
  }
};
</script>

<style lang="scss">
.list-notice {
  a {
    position: relative;
    display: block;
    padding: 15px 0;
    margin: 0 15px;
    border-bottom: 1px solid #f1f1f1;

    div {
      position: relative;
      label {
        position: absolute;
        top: 6px;
        right: 0px;
        width: 6px;
        height: 6px;
        background-color: #ed4040;
        border-radius: 50%;
      }
      p {
        margin: 0;
        padding-bottom: 10px;
        color: #333;
        font-size: 15px;
        padding-right: 23px;
      }
      span {
        color: #999;
        font-size: 12px;
      }
    }
    mark {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      background: transparent;
      border: 1px solid #999;
      border-top: none;
      border-left: none;
      height: 10px;
      width: 10px;
      transform: rotate(-45deg) translate(0, -5px);
      transform-origin: bottom;
    }
    &.readed {
      p {
        color: #999;
      }
    }
  }
}
</style>
