export default {
  name: '通稿库',
  pages: [
    {
      name: '通稿详情',
      path: '/clues/:clue_id',
      component: require('./clue/clue').default
    }
  ]
};
