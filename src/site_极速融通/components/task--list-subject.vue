<template>
  <div class="task--list-subjects subject--list-tasks">
    <h3>关联选题</h3>
    <router-link class="item" :to="`/subjects/${subject.id}`" v-if="subject">
      <p>{{subject.title}}</p>
      <footer>
        <span>{{subject.creator_nickname || subject.creator_username}}</span>
        <span>{{subject.source}}</span>
        <span>{{subject.category}}</span>
        <time>{{subject.creation_time | ds_time('yyyy-MM-dd: hh:mm')}}</time>
      </footer>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    subject: {
      type: Object
    }
  }
};
</script>