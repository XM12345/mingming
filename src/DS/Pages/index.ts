export default {
  name: '基础路由',
  pages: [
    require('./monitor').default,
    require('./subject').default,
    require('./doc').default,
    require('./weibo').default,
    require('./weixin').default,
    require('./clue').default,
    require('./news').default,
    require('./user').default,
    require('./general').default
  ]
};
