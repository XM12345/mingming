export default {
  '*': {
    name: '页面未找到',
    component: require('./Pages/404').default
  },
  '/notice': {
    name: '公告列表',
    component: require('./Pages/general/notice').default
  },
  '/notices/:notice_id': {
    name: '公告详情',
    component: require('./Pages/general/notice-detail').default
  },
  '/tasks/:task_id': {
    name: '任务详情',
    component: require('./Pages/subject/task').default
  },
  '/clues': require('./Pages/clue').default,
  '/cms': require('./Pages/cms').default,
  '/docs': require('./Pages/doc').default,
  '/series': require('./Pages/series').default,
  '/news': require('./Pages/news').default,
  '/weixin': require('./Pages/weixin').default,
  '/weibo': require('./Pages/weibo').default,
  '/user': require('./Pages/user').default,
  //'/monitor': require('./Pages/monitor').default,
  '/subjects': require('./Pages/subject').default,
  '': require('./Pages/monitor').default // 兼容APP旧的地址
};
