export default {
  name: '微博文稿',
  component: require('./weibo/weibo').default,
  routes: {
    '/search': {
      name: '微博搜索',
      component: require('./weibo/weibo-search').default
    },
    '/articles/:article_id': {
      name: '微博文稿详情',
      component: require('./weibo/weibo-content').default
    },
    '/articles/:article_id/push': {
      name: '微博文稿发布',
      component: require('./weibo/weibo-publish').default
    }
  }
};
