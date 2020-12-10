<template>
  <div class="task--list-subjects subject--list-tasks">
    <h3>关联选题</h3>
    <div class="item" @click="to(subject)" v-if="subject">
      <p>{{ subject.title }}</p>
      <footer>
        <span>{{ subject.creator_nickname || subject.creator_username }}</span>
        <span>{{ subject.source }}</span>
        <span>{{ subject.category }}</span>
        <time>{{ subject.creation_time | ds_time('yyyy-MM-dd: hh:mm') }}</time>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subject: {
      type: Object
    }
  },
  methods: {
    to(subject) {
      this.$toPage('subject', subject.id);
    }
  }
};
</script>
