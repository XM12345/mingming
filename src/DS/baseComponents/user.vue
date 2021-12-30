<template>
  <img :class="[B()]" :src="imgSrc" alt="" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'h-user',
  props: {
    src: { type: String, default: '' }
  },
  data() {
    return {};
  },
  computed: {
    imgSrc(): string {
      return this.src || require('./images/icon-user.png');
    }
  }
});
</script>
