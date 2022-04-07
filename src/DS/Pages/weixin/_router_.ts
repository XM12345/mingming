export default {
  name: '微信文稿',
  component: require('./weixin').default,
  routes: {
    '/:account_id/content/:content_id': {
      name: '微信文稿图文详情',
      component: require('./weixin-content').default
    },
    '/:account_id/content/:content_id/:article_id': {
      name: '微信文稿文章详情',
      component: require('./weixin-article').default
    },

    '/:account_id/content/:content_id/publish/now': {
      name: '微信文稿群发',
      component: require('./weixin-publish').default
    },
    '/search/:col/:columnName': {
      name: '微信搜索',
      component: require('./search').default
    }
  }
};
