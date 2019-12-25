<template>
  <img :src="imgUrl" alt v-if="imgUrl" />
  <img :src="defaultUrl" alt v-else />
</template>

<script>
export default {
  props: {
    imgUrl: {
      defaultUrl: null
    }
  },
  data() {
    return {
      defaultUrl: require('./_images/mine@2x.png')
    };
  }
};
</script>
