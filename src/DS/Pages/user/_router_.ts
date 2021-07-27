export default {
  name: '个人中心',
  component: require('../404').default,
  routes: {
    '/login': {
      name: '登录',
      component: require('./login').default
    },
    '/message/follow': {
      name: '关注消息设置',
      component: require('./message-follow').default
    },
    '/message/task': {
      name: '任务消息设置',
      component: require('./message-task').default
    }
  }
};
