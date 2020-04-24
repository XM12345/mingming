export default {
  name: 'cms新媒体',
  pages: [
    {
      name: '新媒体',
      path: '/cms/content/:content_id',
      component: require('./cms/content').default
    },
    {
      name: '新媒体预览',
      path: '/cms/content-preview/:content_id',
      component: require('./cms/contentPreview').default
    },
    {
      name: '新媒体统计',
      path: '/cms/stat',
      component: require('./cms/stat').default
    }
  ]
};
