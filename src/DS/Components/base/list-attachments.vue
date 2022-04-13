<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">附件</h3>
    <div v-for="item in correlations" :key="item.id" :class="[B('__item')]" @click="download(item)">
      <img :src="item.thumbnail_url || item.cover_url || item.mobject_url || item.url" alt="" />
      <div>
        <p v-if="type === 'clue'">{{ item.mobject_name }}</p>
        <p>{{ item.name }}</p>
        <!-- -1、文件夹0、未知1、图片 2、视频 3、音频 -->
        <span>{{ typeName(item.type) }} | {{ $F.time(item.last_modification_time || item.creation_time) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'base--list-attachments',
  props: {
    mediumId: { required: true, type: Number, default: 0 },
    content: { type: Array, default: () => [] },
    type: { type: String, default: '' },
    columnId: { type: Number, default: 0 }
  },
  data() {
    return {
      correlations: [] as any[]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let { type } = this;
      if (type == 'clue') {
        this.correlations = this.content;
      } else {
        let Model;
        if (type == 'media') {
          Model = this.$Model.Media.correlation(this.mediumId);
        } else if (type == 'doc') {
          Model = this.$Model.Doc.attachments(this.mediumId);
        } else if (type == 'series') {
          Model = this.$Model.Doc.seriesAttachments(this.mediumId);
        } else if (type == 'subject') {
          Model = this.$Model.Subject.atts(this.mediumId);
        }
        Model?.then(data => {
          this.correlations = data;
        });
      }
    },
    typeName(type: number) {
      if (type == -1) {
        return '文件夹';
      } else {
        return ['未知文件', '图片', '视频', '音频'][type];
      }
    },
    download(item: any) {
      let { type, mediumId, columnId } = this;
      let result = {
        type: type,
        media: JSON.stringify({
          id: item.id,
          type: item.type,
          name: item.name || item.mobject_name,
          url: item.url || item.mobject_url,
          cover_url: item.thumbnail_url || item.cover_url,
          creation_time: item.creation_time,
          versions: item.versions
        }),
        extension: ''
      };
      if (type == 'clue') {
        result.extension = JSON.stringify({
          column_id: columnId,
          content_id: mediumId,
          medium_id: item.id
        });
      } else if (type == 'subject' || type == 'doc') {
        result.extension = JSON.stringify({
          content_id: mediumId
        });
      }
      console.log(result);
      // 回调原生跳转下载
      this.$toMedia(result);
    }
  }
});
</script>

<style lang="scss">
.base--list-attachments {
  background-color: #fff;
  border-bottom: 10px solid #f4f6f9;
  &__title {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  &__item {
    display: block;
    margin: 0 15px;
    padding: 15px 0;

    img {
      float: left;
      width: 64px;
      height: 36px;
      background-color: #eee;
      vertical-align: middle;
    }
    div {
      padding-left: 70px;
      vertical-align: middle;

      p {
        margin: 0;
        color: #333;
        font-size: 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      span {
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>
