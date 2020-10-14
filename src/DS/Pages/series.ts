export default {
  name: '串联单',
  component: require('./doc/seriesList').default,
  routes: {
    '/add': {
      name: '新增串联单',
      component: require('./doc/series-add').default
    },
    '/search': {
      name: '串联单搜索',
      component: require('./doc/search').default
    },
    '/edit/:series_id': {
      name: '编辑串联单',
      component: require('./doc/series-add').default
    },
    '/:series_id': {
      name: '串联单详情',
      component: require('./doc/series').default
    }
  }
};
