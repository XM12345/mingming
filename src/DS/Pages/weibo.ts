export default {
  name: '微博文稿',
  pages: [
    {
      name: '微博文稿',
      path: '/weibo',
      component: require('./weibo/weibo').default
    },
    {
      name: '微博文稿详情',
      path: '/weibo/articles/:article_id',
      component: require('./weibo/weibo-content').default
    },
    {
      name: '微博文稿发布',
      path: '/weibo/articles/:article_id/push',
      component: require('./weibo/weibo-publish').default
    },
    {
      name: '微博搜索',
      path: '/search/weibo',
      component: require('./weibo/weibo-search').default
    }
  ]
};
