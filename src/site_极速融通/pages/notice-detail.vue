<template>
  <div class="page-notice-detail">
    <h-topbar title="公告"></h-topbar>
    <div class="page-notice-detail-main">
      <header class="main-header">
        <h3>{{content.title}}</h3>
        <p>
          <span>{{content.author_nickname || content.author_name}}</span>
          <time>{{parseInt(content.creation_time) | ds_time}}</time>
        </p>
      </header>
      <h-parse-body :content="content"></h-parse-body>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      content: ''
    };
  },
  created() {
    let { params } = this.$route;
    let { notice_id } = params;
    this.$Model.General.notice(notice_id).then(data => {
      this.content = data;
    });
  }
};
</script>


<style lang="scss">
.page-notice-detail {
  &-main {
    padding: 15px;
    border-top: 10px solid #f4f6f9;
    .main-header {
      text-align: center;
      h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
        font-weight: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      p {
        margin: 10px 0;
        font-size: 15px;
        color: #999;

        span {
          padding-right: 15px;
        }
      }
    }
    .h-parse-body {
      article {
        color:#333;
        font-size: 15px;
      }
    }
  }
}
</style>
