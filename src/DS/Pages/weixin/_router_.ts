export default {
  name: '微信文稿',
  component: require('./index').default,
  routes: {
    '/:account_id/content/:content_id': {
      name: '微信文稿图文详情',
      component: require('./content').default
    },
    '/:account_id/content/:content_id/:article_id': {
      name: '微信文稿文章详情',
      component: require('./article').default
    },

    '/:account_id/content/:content_id/publish/now': {
      name: '微信文稿群发',
      component: require('./publish').default
    },
    '/search/:col/:columnName': {
      name: '微信搜索',
      component: require('./search').default
    }
  }
};
