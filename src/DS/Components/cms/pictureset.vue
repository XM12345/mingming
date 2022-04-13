<template>
  <section :class="[B()]">
    <div v-for="item in list" :key="item.id" :class="[B('__item')]">
      <div :class="[B('__item_image')]">
        <img
          :src="$F.image(item.url, 'L')"
          :alt="item.introduction"
          :style="{ height: (item.height * 100) / item.width + 'vw' }"
        />
      </div>
      <p :class="[B('__item_introduction')]">{{ item.introduction }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'cms--picturesets',
  props: {
    extension: { required: true, type: Object, default: () => ({}) },
    baview_api_url: { required: true, type: String, default: '' }
  },

  data() {
    return {
      list: [] as any[]
    };
  },

  created() {
    console.warn('CMS:TODO 图组样式');
    let { pictureset_id } = this.extension;
    this.$Model
      .Cms(this.baview_api_url)
      .picturesets(pictureset_id)
      .then(data => {
        if (data[0] && data[0].pictures) {
          this.list = data[0].pictures;
        }
      });
  }
});
</script>

<style lang="scss">
.cms--picturesets {
  background: #000;
  color: #fff;

  &__item {
    &_image {
      display: block;
      width: 100%;
      height: auto;
    }
    &_introduction {
      margin: 0;
      font-size: 14px;
      padding: 5px 13px 18px;
    }
  }
}
</style>
