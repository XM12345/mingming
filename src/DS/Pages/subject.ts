export default {
  name: '选题任务',
  pages: [
    {
      name: '选题详情',
      path: '/subjects/:subject_id',
      component: require('./subject/subject').default
    },
    {
      name: '任务详情',
      path: '/tasks/:task_id',
      component: require('./subject/task').default
    }
  ]
};
