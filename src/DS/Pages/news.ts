export default {
  name: '线索库',
  pages: [
    {
      name: '线索库详情',
      path: '/news/:news_id',
      component: require('./news/news').default
    }
  ]
};
