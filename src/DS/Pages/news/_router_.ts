export default {
  name: '线索库',
  component: require('../404').default,
  routes: {
    '/:news_id': {
      name: '线索库详情',
      component: require('./news').default
    }
  }
};
