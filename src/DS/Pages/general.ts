export default {
  name: '基础中心',
  pages: [
    {
      name: '公告列表',
      path: '/notice',
      component: require('./general/notice').default
    },
    {
      name: '公告详情',
      path: '/notices/:notice_id',
      component: require('./general/notice-detail').default
    }
  ]
};