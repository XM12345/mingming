export default {
  name: '通稿库',
  component: require('../404').default,
  routes: {
    '/:clue_id': { name: '通稿详情', component: require('./content').default }
  }
};
