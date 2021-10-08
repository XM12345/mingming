<template>
  <h-popup :class="[B()]" v-model="isPopupVisible" position="bottom" :overlayStyle="overlayStyle">
    <footer>
      <input placeholder="请输入审核意见" v-model.trim="comment" />
      <button class="s-fail" @click="audit(false)">退回</button>
      <button class="s-success" @click="audit(true)">通过</button>
    </footer>
  </h-popup>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: { value: { type: Boolean, default: false } },
  name: 'h-popup-audit',
  data() {
    return {
      comment: ''
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
    audit(pass: boolean) {
      this.$emit('audit', { pass, comment: this.comment });
    }
  }
});
</script>

<style lang="scss">
.h-popup-audit {
  width: 100%;
  min-height: 70px;
  & > footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: inline-flex;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #efefef;

    input {
      max-width: calc(100% - 140px);
      font-size: 15px;
      border: none;
      border-bottom: 1px solid #eaeaea;
      padding: 12px 0 12px 40px;
      flex-grow: 1;
      margin-right: 5px;
      background-image: url('~@/assets/luyin@3x.png');
      background-repeat: no-repeat;
      background-size: 29px;
      background-position: left center;
    }
    button {
      width: 40px;
      height: 27px;
      font-size: 12px;
      color: #fff;
      border: none;
      flex-shrink: 0;
      margin: 0 5px;
      white-space: nowrap;
      text-align: center;

      &.s-fail {
        background-color: #f64d65;
      }
      &.s-success {
        background-color: #1890ff;
      }
    }
  }
}
</style>
