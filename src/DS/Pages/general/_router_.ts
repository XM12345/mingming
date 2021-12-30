export default {
  name: '基础中心',
  component: require('../404').default,
  routes: {
    '/notice': { name: '公告列表', component: require('./notice-index').default },
    '/notices/:notice_id': { name: '公告详情', component: require('./notice-content').default }
  }
};
