export default {
  name: '电视文稿',
  pages: [
    {
      name: '添加文稿',
      path: '/docs/doc-add',
      component: require('./doc/doc-add').default
    },
    {
      name: '选择文稿',
      path: '/docs/doc-add/:doc_ids',
      component: require('./doc/doc-add').default
    },
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
      name: '选择用户',
      path: '/docs/user/add/:type_name',
      component: require('./doc/add-user').default
    },
    {
      name: '编辑用户',
      path: '/docs/user/add/:type_name/:user_ids',
      component: require('./doc/add-user').default
    },
    {
      name: '串联单',
      path: '/series',
      component: require('./doc/seriesList').default
    },
    {
      name: '新增串联单',
      path: '/series/add',
      component: require('./doc/series-add').default
    },
    {
      name: '编辑串联单',
      path: '/series/edit/:series_id',
      component: require('./doc/series-add').default
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
