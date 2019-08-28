<template>
  <div class="subject--list-tasks">
    <h3>关联任务</h3>
    <router-link class="item" :to="`/tasks/${item.id}`" v-for="item in tasks" :key="item.id">
      <p>{{item.name}}</p>
      <footer>
        <span class="s-mark">{{item.type_name}}</span>
        <time>截止时间: {{item.expire_time | ds_time('yyyy-MM-dd: hh:mm')}}</time>
        <span>{{item.creator_nickname || item.creator_username}}</span>
      </footer>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    mediumId: {
      required: true,
      default: undefined
    }
  },
  data() {
    return {
      tasks: []
    };
  },
  created() {
    this.$Model.Subject.tasks(this.mediumId).then(data => {
      this.tasks = data;
    });
  }
};
</script>

<style lang="scss">
.subject--list-tasks {
  background-color: #fff;
  border-bottom: 10px solid #f4f6f9;
  h3 {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  .item {
    display: block;
    padding: 10px 15px;
    p {
      font-size: 15px;
      color: #333;
      margin: 0;
      margin-bottom: 10px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    footer {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      span,
      time {
        color: #999;
      }
      .s-mark {
        color: #333;
        position: relative;
        padding-left: 20px;
        &::before {
          content: '';
          background: url('../images/detail/interview@2x.png');
          position: absolute;
          left: 0;
          width: 16px;
          height: 16px;
          background-size: cover;
        }
      }
    }
  }
}
</style>
