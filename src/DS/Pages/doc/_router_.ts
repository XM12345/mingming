export default {
  name: '电视文稿',
  component: require('../404').default,
  routes: {
    '/doc-add': {
      name: '添加文稿',
      component: require('./add').default
    },
    '/doc-add/:doc_ids': {
      name: '选择文稿',
      component: require('./add').default
    },
    '/:doc_id': {
      name: '文稿详情',
      component: require('./content').default
    },
    '/:doc_id/histories/:ver': {
      name: '电视文稿历史版本',
      component: require('./history').default
    },
    '/:col_id/user/add/:type_name': {
      name: '选择用户',
      component: require('./add-user').default
    },
    '/:col_id/user/add/:type_name/:user_ids': {
      name: '编辑用户',
      component: require('./add-user').default
    },
    '/series/add': {
      name: '新增串联单',
      component: require('./series-add').default
    },
    '/series/search': {
      name: '串联单搜索',
      component: require('./series-search').default
    },
    '/series/edit/:series_id': {
      name: '编辑串联单',
      component: require('./series-add').default
    },
    '/series/:series_id': {
      name: '串联单详情',
      component: require('./series-content').default
    }
  }
};
