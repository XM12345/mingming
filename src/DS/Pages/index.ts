export default {
  '*': {
    name: '页面未找到',
    component: require('./404').default
  },
  '': require('./general/_router_').default,
  '/clues': require('./clue/_router_').default,
  '/cms': require('./cms/_router_').default,
  '/docs': require('./doc/_router_').default,
  '/news': require('./news/_router_').default,
  '/weixin': require('./weixin/_router_').default,
  '/weibo': require('./weibo/_router_').default,
  '/user': require('./user/_router_').default,
  '/monitor': require('./monitor/_router_').default,
  '/subjects': require('./subject/_router_').default,

  /** 暂时兼容旧的路由，待稳定后删除，避免地址丢失 */
  '/series': {
    name: '串联单',
    component: require('./doc/series-index').default,
    routes: {
      '/:series_id': {
        name: '串联单详情',
        component: require('./doc/series-content').default
      }
    }
  },
  '/tasks/:task_id': {
    name: '任务详情',
    component: require('./subject/task-content').default
  },
  '/signals/:signal_id': {
    name: '信号监控详情',
    component: require('./monitor/signal-content').default
  },
  '/devices/:device_id': {
    name: '设备详情',
    component: require('./monitor/device-content').default
  },
  '/machine-roomes/devices/:device_id': {
    name: '机房设备详情',
    component: require('./monitor/room-content').default
  },
  '/apps/:app_id': {
    name: '应用详情',
    component: require('./monitor/app-content').default
  },
  '/alarms/:alarm_id': {
    name: '报警详情',
    component: require('./monitor/alarm-content').default
  }
};
