<template>
  <div class="page-notice-detail">
    <base--topbar title="公告"></base--topbar>
    <div class="page-notice-detail-main">
      <header class="main-header">
        <h3>{{content.title}}</h3>
        <p>
          <span>{{content.author_nickname || content.author_name}}</span>
          <time>{{parseInt(content.creation_time) | ds_time('yyyy-MM-dd hh:mm')}}</time>
        </p>
      </header>
      <base--parse-body :content="content"></base--parse-body>
      <div class="s-attachments" v-if="content.attachments && content.attachments.length">
        <h3>附件</h3>
        <a
          :href="`${item.url}?d=${item.title}`"
          :download="item.title"
          v-for="item in content.attachments"
          :key="item.id"
        >
          <p>{{item.title}}</p>
          <span>{{item.size | ds_size}}</span>
        </a>
      </div>
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
      this.$title(data.title);
    });
    // 标记已读
    this.$Model.General.read(notice_id).then(() => {});
  }
};
</script>


<style lang="scss">
.page-notice-detail {
  &-main {
    padding: 10px;
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
        word-break: break-word;
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
        color: #333;
        font-size: 15px;

        table {
          width: auto !important;
          height: auto !important;
          border: 1px solid #ccc;
          border-collapse: collapse;
          word-break: normal;
          text-align: center;
          font-size: 14px;
          td {
            width: auto !important;
            border: 1px solid #ccc;
            padding: 12px 10px;
          }
        }
      }
    }
    .s-attachments {
      h3 {
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        color: #333;
      }
      a {
        display: block;
        font-size: 12px;
        padding: 10px 0;
        p {
          margin: 0;
          margin-bottom: 5px;
          color: #333;
        }
        span {
          color: #999;
        }
      }
    }
  }
}
</style>
