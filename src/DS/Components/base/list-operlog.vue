<template>
  <div class="list-operlog list-comments">
    <h3>操作纪录</h3>
    <div class="list-comments-item" v-for="item in operlog" :key="item.id">
      <!-- weixin:avatarUrl -->
      <base--img :imgUrl="item.icon_url || item.avatarUrl"></base--img>
      <div>
        <p>
          <!-- weixin:creatorNickname || creatorUsername,subject:operatorNickname -->
          {{item.operator_nickname || item.creatorNickname || item.creatorUsername || item.operatorNickname}}
          <mark
            v-if="item.status_name"
          >[{{item.status_name}}]</mark>
        </p>
        <!-- subject:description -->
        <span>{{item.title || item.description || item.type}}</span>
      </div>
      <!-- weixin:creationTime,subject:operateTime -->
      <time>{{item.operate_time || item.creationTime || item.operateTime | ds_time}}</time>
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
      operlog: []
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
  methods: {
    init() {
      let { type } = this;
      let Model;
      if (type == 'doc') {
        Model = this.$Model.Doc.operlog(this.mediumId);
      } else if (type == 'subject') {
        Model = this.$Model.Subject.operlog(this.mediumId);
      } else if (type == 'weixin') {
        Model = this.$Model.Weixin.logs(this.accountId, this.mediumId);
      }
      Model.then(data => {
        this.operlog = data;
      });
    }
  }
};
</script>