<template>
  <div :class="[B()]">
    <h3 :class="[B('__title')]">关联选题</h3>
    <div v-if="subject" :class="[B('__item')]" @click="to(subject.id)">
      <p>{{ subject.title }}</p>
      <footer :class="[B('__footer')]">
        <span>{{ subject.creator_nickname || subject.creator_username }}</span>
        <span>{{ subject.source }}</span>
        <span>{{ subject.category }}</span>
        <time>{{ $F.time(subject.creation_time, 'yyyy-MM-dd hh:mm') }}</time>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'subject--list-subject',
  props: {
    subject: { required: true, type: Object, default: () => ({}) }
  },
  methods: {
    to(id: number) {
      this.$toPage('subject', id);
    }
  }
});
</script>

<style lang="scss">
.subject--list-subject {
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
  }
}
</style>
