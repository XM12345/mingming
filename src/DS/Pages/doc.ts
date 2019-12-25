export default {
  name: '电视文稿',
  pages: [
    {
      name: '文稿详情',
      path: '/docs/:doc_id',
      component: require('./doc/doc').default
    },
    {
      name: '电视文稿历史版本',
      path: '/docs/:doc_id/histories/:ver',
      component: require('./doc/doc-history').default
    },
    {
      name: '串联单',
      path: '/series',
      component: require('./doc/seriesList').default
    },
    {
      name: '串联单详情',
      path: '/series/:series_id',
      component: require('./doc/series').default
    },
    {
      name: '串联单搜索',
      path: '/search/series',
      component: require('./doc/search').default
    }
  ]
};
