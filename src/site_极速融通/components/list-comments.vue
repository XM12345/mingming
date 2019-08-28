<template>
  <div class="list-comments">
    <h3>批注</h3>
    <div class="list-comments-item" v-for="item in logs" :key="item.id">
      <!-- doc&&series:avatar_url,weixin:avatarUrl,media:creator_cover_url -->
      <h-img :imgUrl="item.avatar_url || item.avatarUrl || item.icon_url || item.creator_cover_url"></h-img>
      <div>
        <p>
          <!-- weixin: creatorNickname || creatorUsername-->
          {{item.creator_nickname || item.creator_username || item.creatorNickname || item.creatorUsername}}
          <mark
            v-if="item.status_name || item.statusName"
          >[{{item.status_name || item.statusName}}]</mark>
        </p>
        <!-- weixin:body,media:detail -->
        <span>{{item.content || item.body || item.detail}}</span>
      </div>
      <!-- weixin:creationTime -->
      <time>{{item.creation_time || item.creationTime | ds_time}}</time>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mediumId: {
      required: true,
      default: undefined
    },
    type: {
      type: String,
      default: ''
    },
    accountId: {
      default: undefined
    },
    isComment: {
      default: false
    },
    isAudit: {
      default: false
    }
  },
  data() {
    return {
      logs: []
    };
  },
  created() {
    this.init();
  },
  watch: {
    isComment() {
      if (this.isComment == false) {
        this.init();
      }
    },
    isAudit() {
      if (this.isAudit == false) {
        this.init();
      }
    }
  },
  mounted() {
    // app刷新批注
    //console.log(window.DfsxNative,window.DfsxWeb)
    window.DfsxWeb.freshComment = this.getComment;
  },
  methods: {
    init() {
      let { type } = this;
      let Model;
      if (type == 'series') {
        Model = this.$Model.Doc.series_comments(this.mediumId);
      } else if (type == 'media') {
        Model = this.$Model.Media.logs(this.mediumId);
      } else if (type == 'clue') {
        Model = this.$Model.Clue.postils(this.mediumId);
      } else if (type == 'doc') {
        Model = this.$Model.Doc.docs_comments(this.mediumId);
      } else if (type == 'subject') {
        Model = this.$Model.Subject.comments(this.mediumId);
      } else if (type == 'weixin') {
        Model = this.$Model.Weixin.comments(this.accountId, this.mediumId);
      } else if (type == 'weibo') {
        Model = this.$Model.Weibo.postils(this.mediumId);
      } else if (type == 'task') {
        Model = this.$Model.Subject.task_comments(this.mediumId);
      }
      Model.then(data => {
        if (type == 'media') {
          this.logs = data.data;
        } else {
          this.logs = data;
        }
      });
    },
    getComment() {
      this.init();
    }
  }
};
</script>

<style lang="scss">
.list-comments {
  background-color: #fff;
  border-bottom: 10px solid #f4f6f9;
  h3 {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  &-item {
    font-size: 12px;
    position: relative;
    padding: 15px;

    img {
      float: left;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #eee;
      vertical-align: middle;
    }
    div {
      vertical-align: middle;
      padding-left: 50px;

      p {
        min-height: 21px;
        margin: 0;
        padding-bottom: 5px;
        padding-right: 60px;
        color: #999;

        mark {
          background-color: #fff;
          color: inherit;
          padding-left: 30px;
        }
      }

      span {
        display: block;
        word-break: break-word;
        color: #333;
      }
    }
    time {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #999;
    }
  }
}
</style>

