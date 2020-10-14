export default {
  name: 'cms新媒体',
  component: require('./404').default,
  routes: {
    '/content/:content_id': {
      name: '新媒体',
      component: require('./cms/content').default
    },
    '/content-preview/:content_id': {
      name: '新媒体预览',
      component: require('./cms/contentPreview').default
    },
    '/stat': {
      name: '新媒体统计',
      component: require('./cms/stat').default
    }
  }
};
