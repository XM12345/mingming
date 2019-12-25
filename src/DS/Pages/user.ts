export default {
  name: '个人中心',
  pages: [
    {
      name: '登录',
      path: '/user/login',
      component: require('./user/login').default
    },
    {
      name: '关注消息设置',
      path: '/user/message/follow',
      component: require('./user/message-follow').default
    },
    {
      name: '任务消息设置',
      path: '/user/message/task',
      component: require('./user/message-task').default
    }
  ]
};
