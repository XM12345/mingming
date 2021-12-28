<template>
  <section class="cms--picturesets">
    <div v-for="item in list" :key="item.id">
      <div>
        <img
          :src="$F.image(item.url, 'L')"
          alt="item.introduction"
          :style="{ height: (item.height * 100) / item.width + 'vw' }"
        />
      </div>
      <p>{{ item.introduction }}</p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    extension: {
      required: true
    },
    baview_api_url: {
      required: true
    }
  },

  data() {
    return {
      list: []
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
};
</script>

<style lang="scss">
.cms--picturesets {
  background: #000;
  color: #fff;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  p {
    margin: 0;
    font-size: 14px;
    padding: 5px 13px 18px;
  }
}
</style>
