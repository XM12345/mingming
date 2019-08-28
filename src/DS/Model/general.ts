import BaseModel from './baseModel';
type ID = number | string;
export default class General extends BaseModel {
  notices() {
    // 获取公告列表
    // http://v1.api.example.com/internal/notices
    return super.$get('/notices');
  }
  notice(notice_id: ID) {
    // 获取公告
    // http://v1.api.example.com/internal/notices/{notice-id}
    return super.$get(`/notices/${notice_id}`);
  }
}