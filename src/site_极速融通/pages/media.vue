<template>
  <div class="page-material-detail">
    <h-topbar></h-topbar>
    <header class="s-header">
      <img :src="content.mobject_url || content.cover_url" v-if="content.type==1" />
      <video
        controls="controls"
        :src="content.mobject_url"
        :poster="content.cover_url"
        preload="auto"
        x5-video-player-type="h5"
        v-else-if="content.type==2 || content.type==3"
      ></video>
    </header>
    <div class="s-main">
      <h-tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch">
        <list-message :content="content" type="media" v-if="tabKey == 'message'"></list-message>
        <list-attachments :mediumId="content.id" type="media" v-if="tabKey == 'attachments'"></list-attachments>
      </h-tab>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabKey: 'message',
      navItems: [
        { name: '基本信息', key: 'message' },
        { name: '相关素材', key: 'attachments' },
        { name: '操作纪录', key: 'records' }
      ],
      content: {}
    };
  },
  created() {
    let { params } = this.$route;
    let { medium_id } = params;
    this.$Model.Media.media(medium_id).then(data => {
      this.content = data;
      this.$title(data.name)
      this.tabKey = this.navItems[0].key || '';
    });
  },
  methods: {
    onSwitch(key) {
      this.tabKey = key;
    }
  }
};
</script>

<style lang="scss">
.page-material-detail {
  height: 100%;
  background-color: #fff;
  //padding-bottom: 72px;
  .h-topbar {
    height: 0;
    header {
      background: none;
      border-bottom: none;

      a {
        &::before,
        &::after {
          background: #fff;
        }
      }
    }
  }
  header.s-header {
    height: 66vw;
    img {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }
    video {
      width: 100%;
    }
  }
  .s-main {
    height: calc(100% - 66vw - 73px);
  }
}
</style>
