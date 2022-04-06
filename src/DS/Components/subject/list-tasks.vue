<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">关联任务</h3>
    <div v-for="item in tasks" :key="item.id" :class="[B('__item')]" @click="to(item.id)">
      <p>{{ item.name }}</p>
      <footer :class="[B('__footer')]">
        <span :class="[B('__footer_type')]">{{ item.type_name }}</span>
        <time>截止时间: {{ $F.time(item.expire_time, 'yyyy-MM-dd hh:mm') }}</time>
        <span>{{ item.creator_nickname || item.creator_username }}</span>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'subject--list-tasks',
  props: {
    mediumId: { required: true, type: Number, default: 0 }
  },
  data() {
    return {
      tasks: [] as any[]
    };
  },
  created() {
    this.init();
  },
  mounted() {
    if (window.DfsxWeb) {
      window.DfsxWeb.freshState = this.init;
    }
  },
  methods: {
    async init() {
      this.tasks = await this.$Model.Subject.tasks(this.mediumId);
    },
    to(id: number) {
      this.$toPage('task', id);
    }
  }
});
</script>

<style lang="scss">
.subject--list-tasks {
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
  }
  &__footer {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    color: #999;
    &_type {
      color: #333;
      position: relative;
      padding-left: 20px;
      &::before {
        content: '';
        background: url('./_images/icon-interview.png');
        position: absolute;
        left: 0;
        width: 16px;
        height: 16px;
        background-size: cover;
      }
    }
  }
}
</style>
