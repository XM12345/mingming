export default {
  name: '设备监控',
  pages: [
    {
      name: '信号监控详情',
      path: '/signals/:signal_id',
      component: require('./monitor/signal-content').default
    },
    {
      name: '设备详情',
      path: '/devices/:device_id',
      component: require('./monitor/device-content').default
    },
    {
      name: '机房设备详情',
      path: '/machine-roomes/devices/:device_id',
      component: require('./monitor/room-content').default
    },
    {
      name: '应用详情',
      path: '/apps/:app_id',
      component: require('./monitor/app-content').default
    },
    {
      name: '报警详情',
      path: '/alarms/:alarm_id',
      component: require('./monitor/alarm-content').default
    },
    {
      name: '添加监控设置',
      path: '/control/settings',
      component: require('./monitor/control-post').default
    },
    {
      name: '修改监控设置',
      path: '/control/settings/:index',
      component: require('./monitor/control-post').default
    }
  ]
};
