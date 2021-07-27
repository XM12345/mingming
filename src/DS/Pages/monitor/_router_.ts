export default {
  name: '设备监控',
  component: require('../404').default,
  routes: {
    '/signals/:signal_id': {
      name: '信号监控详情',
      component: require('./signal-content').default
    },
    '/signals/:signal_id/:date/playback/:index': {
      name: '信号监控回看',
      component: require('./signal-playback').default
    },
    '/devices/:device_id': {
      name: '设备详情',
      component: require('./device-content').default
    },
    '/machine-roomes/devices/:device_id': {
      name: '机房设备详情',
      component: require('./room-content').default
    },
    '/apps/:app_id': {
      name: '应用详情',
      component: require('./app-content').default
    },
    '/alarms/:alarm_id': {
      name: '报警详情',
      component: require('./alarm-content').default
    },
    '/control/settings': {
      name: '添加监控设置',
      component: require('./control-post').default
    },
    '/control/settings/:index': {
      name: '修改监控设置',
      component: require('./control-post').default
    }
  }
};
