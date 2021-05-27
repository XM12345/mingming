export default {
  name: '设备监控',
  component: require('./404').default,
  routes: {
    '/signals/:signal_id': {
      name: '信号监控详情',
      component: require('./monitor/signal-content').default
    },
    '/signals/:signal_id/:date/playback/:index': {
      name: '信号监控回看',
      component: require('./monitor/signal-playback').default
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
    },
    '/control/settings': {
      name: '添加监控设置',
      component: require('./monitor/control-post').default
    },
    '/control/settings/:index': {
      name: '修改监控设置',
      component: require('./monitor/control-post').default
    }
  }
};
