<template>
  <div class="page-cms--list-attachments">
    <h3>素材列表</h3>
    <h-link
      class="page-cms--list-attachments-item"
      :to="item"
      v-for="item in correlations"
      :key="item.id"
    >
      <img :src="item.thumbnail_url" alt v-if="type == 'doc'" />
      <img :src="item.cover_url || item.url" alt v-else />
      <div>
        <p v-if="type=='clue'">{{item.mobject_name}}</p>
        <p>{{item.name}}</p>
        <!-- -1、文件夹0、未知1、图片 2、视频 3、音频 -->
        <span>{{item.type | filter_type}} | {{item.last_modification_time || item.creation_time | ds_time}}</span>
      </div>
    </h-link>
  </div>
</template>
<script>
export default {
  props: {
    mediumId: {
      required: true,
      default: undefined
    },
    content: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      correlations: []
    };
  },
  created() {
    this.init();
  },
  filters: {
    filter_type(type) {
      if (type == -1) {
        return '文件夹';
      } else {
        return ['未知文件', '图片', '视频', '音频'][type];
      }
    }
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
        } else if (type == 'subject') {
          Model = this.$Model.Subject.atts(this.mediumId);
        }
        Model.then(data => {
          this.correlations = data;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.page-cms--list-attachments {
  background-color: #fff;
  border-bottom: 10px solid #f4f6f9;
  h3 {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  &-item {
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
