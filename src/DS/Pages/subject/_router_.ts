export default {
  name: '选题任务',
  component: require('../404').default,
  routes: {
    '/:subject_id': {
      name: '选题详情',
      component: require('./subject').default
    },
    '/tasks/:task_id': {
      name: '任务详情',
      component: require('./task').default
    }
  }
};
