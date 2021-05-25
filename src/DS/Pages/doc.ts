export default {
  name: '电视文稿',
  component: require('./404').default,
  routes: {
    '/doc-add': {
      name: '添加文稿',
      component: require('./doc/doc-add').default
    },
    '/doc-add/:doc_ids': {
      name: '选择文稿',
      component: require('./doc/doc-add').default
    },
    '/:doc_id': {
      name: '文稿详情',
      component: require('./doc/doc').default
    },
    '/:doc_id/histories/:ver': {
      name: '电视文稿历史版本',
      component: require('./doc/doc-history').default
    },
    '/:col_id/user/add/:type_name': {
      name: '选择用户',
      component: require('./doc/add-user').default
    },
    '/:col_id/user/add/:type_name/:user_ids': {
      name: '编辑用户',
      component: require('./doc/add-user').default
    }
  }
};
