export default {
  name: 'cms新媒体',
  component: require('../404').default,
  routes: {
    '/content/:content_id': {
      name: '新媒体',
      component: require('./content').default
    },
    '/content-preview/:content_id': {
      name: '新媒体预览',
      component: require('./contentPreview').default
    },
    '/stat': {
      name: '新媒体统计',
      component: require('./stat').default
    }
  }
};
