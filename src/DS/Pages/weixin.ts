export default {
  name: '微信文稿',
  pages: [
    {
      name: '微信文稿',
      path: '/weixin',
      component: require('./weixin/weixin').default
    },
    {
      name: '微信文稿图文详情',
      path: '/weixin/:account_id/content/:content_id',
      component: require('./weixin/weixin-content').default
    },
    {
      name: '微信文稿文章详情',
      path: '/weixin/:account_id/content/:content_id/:article_id',
      component: require('./weixin/weixin-article').default
    },
    {
      name: '微信文稿群发',
      path: '/weixin/:account_id/content/:content_id/publish/now',
      component: require('./weixin/weixin-publish').default
    },
    {
      name: '微信搜索',
      path: '/search/:col/:columnName',
      component: require('./weixin/weixin-search').default
    }
  ]
};
