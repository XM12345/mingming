import './style.scss';
export default {
  name: '极速融通2.0',
  title: '极速融通2.0',
  app: {
    schemeIOS: 'dfsxjsrt',
    schemeAndroid: 'dfsxjsrt'
  },
  componentsContext: require.context('./components', false, /\.vue$/),
  pages: [
    {
      name: '登录',
      path: '/user/login',
      component: require('./pages/login').default
    },
    {
      name: '选题详情',
      path: '/subjects/:subject_id',
      component: require('./pages/subject').default
    },
    {
      name: '素材详情',
      path: '/media/:medium_id',
      component: require('./pages/media').default,
      meta: {
        app: 'media/content?medium_id={medium_id}'
      }
    },
    {
      name: '串联单',
      path: '/series',
      component: require('./pages/seriesList').default
    },
    {
      name: '串联单详情',
      path: '/series/:series_id',
      component: require('./pages/series').default
    },
    {
      name: '串联单搜索',
      path: '/search/series',
      component: require('./pages/search').default
    },
    {
      name: '微信搜索',
      path: '/search/:col/:columnName',
      component: require('./pages/weixin-search').default
    },
    {
      name: '微博搜索',
      path: '/search/weibo',
      component: require('./pages/weibo-search').default
    },
    {
      name: '公告列表',
      path: '/notice',
      component: require('./pages/notice').default
    },
    {
      name: '公告详情',
      path: '/notices/:notice_id',
      component: require('./pages/notice-detail').default
    },
    {
      name: '通稿详情',
      path: '/clues/:clue_id',
      component: require('./pages/clue').default
    },
    {
      name: '文稿详情',
      path: '/docs/:doc_id',
      component: require('./pages/doc').default
    },
    {
      name: '电视文稿历史版本',
      path: '/docs/:doc_id/histories/:ver',
      component: require('./pages/doc-history').default
    },
    {
      name: '微博文稿',
      path: '/weibo',
      component: require('./pages/weibo').default
    },
    {
      name: '微博文稿详情',
      path: '/weibo/articles/:article_id',
      component: require('./pages/weibo-content').default
    },
    {
      name: '微博文稿发布',
      path: '/weibo/articles/:article_id/push',
      component: require('./pages/weibo-publish').default
    },
    {
      name: '微信文稿',
      path: '/weixin',
      component: require('./pages/weixin').default
    },
    {
      name: '微信文稿图文详情',
      path: '/weixin/:account_id/content/:content_id',
      component: require('./pages/weixin-content').default
    },
    {
      name: '微信文稿文章详情',
      path: '/weixin/:account_id/content/:content_id/:article_id',
      component: require('./pages/weixin-article').default
    },
    {
      name: '微信文稿群发',
      path: '/weixin/:account_id/content/:content_id/publish/now',
      component: require('./pages/weixin-publish').default
    },
    {
      name: '任务详情',
      path: '/tasks/:task_id',
      component: require('./pages/task').default
    },
    {
      name: '线索库详情',
      path: '/news/:news_id',
      component: require('./pages/news').default
    },
    {
      name: '关注消息设置',
      path: '/user/message/follow',
      component: require('./pages/message-follow').default
    },
    {
      name: '任务消息设置',
      path: '/user/message/task',
      component: require('./pages/message-task').default
    }
  ]
};
