import BaseModel from './baseModel';
type ID = number | string;

export default class Monitor extends BaseModel {
  settings() {
    // 获取我的设置
    // http://v1.api.domain.com/internal/users/current/settings
    return super.$get('/users/current/settings');
  }
  putSettings(data: Object) {
    // 修改我的设置
    // http://v1.api.domain.com/internal/users/current/settings
    return super.$put('/users/current/settings', data);
  }

  alarmList(type: String, target: ID) {
    // 获取报警列表
    // http://v1.api.domain.com/internal/alarms?type={类型}&target={报警对象id,需要和类型一起查询有效}&level={等级0-全部} manager={负责人id,0-全部}&status={报警状态0-全部1-正在报警}&page={页码}&size={每页条数}
    let params = { type, target };
    return super.$get('/alarms', { params });
  }

  alarms(id: ID) {
    // 获取我的报警详情
    // http://v1.api.domain.com/internal/alarms/{id}
    return super.$get(`/alarms/${id}`);
  }
  putAlarms(id: ID, data: Object) {
    // 报警处理意见
    // http://v1.api.domain.com/internal/alarms/{id}
    /*  {
        <key|timestamp, 时间> : <double, 监控值>,
        ……
    } */
    return super.$put(`/alarms/${id}`, data);
  }

  data(type: string, id: ID, index_key: string, { start, stop }: any = {}) {
    // 获取监控数据
    // http://v1.api.domain.com/internal/monitors/{type}/{id}/{index-key}/data?start={开始时间}&stop={结束时间}
    let params = { start, stop };
    return super.$get(`/monitors/${type}/${id}/${index_key}/data`, { params });
  }
  rooms() {
    // 获取所有机房
    // http://v1.api.domain.com/internal/machine-rooms
    return super.$get('/machine-rooms');
  }
  roomDevices(room_id: ID, device_id: ID) {
    // 获取机房设备详情
    // http://v1.api.domain.com/internal/machine-rooms/devices/{device-id}
    return super.$get(`/machine-rooms/devices/${device_id}`);
  }

  deviceList() {
    // 获取设备列表
    // http://v1.api.domain.com/internal/devices?type={设备类型}&resourceGroup={所属资源组}&manager={负责人}&level={运维等级}&page={页码}&size={每页条数}
    return super.$get('/devices');
  }

  devices(device_id: ID) {
    // 获取设备详情
    // http://v1.api.domain.com/internal/devices/{device-id
    return super.$get(`/devices/${device_id}`);
  }

  appList() {
    // 获取应用列表
    // http://v1.api.domain.com/internal/apps?type={应用类型}&resourceGroup={所属资源组}&manager={负责人}&level={运维等}&page={页码}&size={每页条数}
    return super.$get('/apps');
  }
  apps(app_id: ID) {
    // 获取应用详情
    // http://v1.api.domain.com/internal/apps/{app-id}
    return super.$get(`/apps/${app_id}`);
  }

  channels() {
    // 获取所有频道
    // http://v1.api.domain.com/internal/channels
    return super.$get('/channels');
  }

  singalList() {
    // 获取所有信号
    // http://v1.api.domain.com/internal/signals?channel={频道id,不传或0获取全部}
    return super.$get('/signals');
  }

  signals(signal_id: ID) {
    // 获取信号详情
    // http://v1.api.domain.com/internal/signals/{signal-id}
    return super.$get(`/signals/${signal_id}`);
  }

  video(alarm_id: ID) {
    // 获取信号异常视频地址
    // http://v1.api.domain.com/internal/signals/alarms/{alarm-id}/video
    return super.$get(`/signals/alarms/${alarm_id}/video`);
  }

  /**
   * 获取信号回看地址
   * http://192.168.6.120:3100/mock/225/internal/signals/{signal-id}/{date}/playbacks
   */
  playbacks(signal_id: ID, date: string) {
    return super.$get(`/signals/${signal_id}/${date}/playbacks`);
  }

  types() {
    // 获取监控类型
    // http://v1.api.domain.com/internal/monitor-types
    return super.$get('/monitor-types');
  }
  indexes(type: String) {
    // 获取监控指标
    // http://v1.api.domain.com/internal/monitor-types/{type}/monitor-indexes
    return super.$get(`/monitor-types/${type}/monitor-indexes`);
  }
  targets(type: String) {
    // 获取监控对象
    // http://v1.api.domain.com/internal/monitor-types/{type}/targets
    return super.$get(`/monitor-types/${type}/targets`);
  }
  groups() {
    // 获取所有资源组
    // http://v1.api.domain.com/internal/resource-groups
    return super.$get('/resource-groups');
  }

  managers(category: String) {
    // 获取分类负责人
    // http://v1.api.domain.com/internal/categories/{category}/managers
    return super.$get(`/categories/${category}/managers`);
  }
  enums(type: String, index: String) {
    // 获取枚举值
    // http://v1.api.domain.com/internal/monitor-types/{type}/monitor-indexes/{index}/enums
    return super.$get(`/monitor-types/${type}/monitor-indexes/${index}/enums`);
  }
}
