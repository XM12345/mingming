<template>
  <h-popup :class="[B()]" v-model="isPopupVisible" position="bottom" :overlayStyle="overlayStyle">
    <footer>
      <input placeholder="我想说..." v-model.trim="text" />
      <button class="s-success" @click="comment">发表</button>
    </footer>
  </h-popup>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: { value: { type: Boolean, default: false } },
  name: 'h-popup-comment',
  data() {
    return {
      text: ''
    };
  },
  computed: {
    isPopupVisible: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('input', value);
      }
    },
    overlayStyle() {
      return { background: 'transparent', opacity: 0 };
    }
  },
  methods: {
    comment() {
      if (!this.text) {
        // @ts-ignore
        this.$toast('批注不能为空');
      }
      this.$emit('comment', this.text);
    }
  }
});
</script>

<style lang="scss">
.h-popup-comment {
  min-height: 70px;
  width: 100%;
  font-size: 12px;
  & > footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: inline-flex;
    align-items: center;
    padding: 20px 15px;
    background-color: #fff;
    border-top: 1px solid #efefef;

    input {
      flex-grow: 1;
      border: 1px solid #eaeaea;
      height: 29px;
      border-radius: 5px;
      color: #999;
      padding: 0 5px;
    }
    button {
      width: 50px;
      height: 29px;
      background-color: #f5f5f5;
      border: none;
      color: #333;
      border-radius: 5px;
      margin-left: 10px;
    }
  }
}
</style>
