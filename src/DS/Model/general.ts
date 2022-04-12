import BaseModel from './baseModel';
type ID = number | string;
export default class General extends BaseModel {
  /**
   * 获取参数配置
   * http://v1.api.domain.com/internal/config
   * @returns
   */
  config() {
    return super.$get('/internal/config');
  }

  /**
   *
   * @returns 获取用户信息
   */
  getUserCurrent() {
    return super.$get('/internal/members/current');
  }

  /**
   * 获取前台公告列表
   * http://v1.api.example.com/internal/v2/notices?page=1&size=20
   */
  v2Notices(params: { page?: number; size?: number }) {
    return super.$get('/internal/v2/notices', { params });
  }

  /**
   * 获取公告管理列表
   * status公告状态，默认0：0-全部，1-草稿，2-上线，3-下线，4-待审，5-通过，6-退回
   * sort排序方式，默认1： 0 -创建时间降序，1-发布时间降序
   * http://v1.api.example.com/public/v2/notices?page=1&size=20
   */
  notices(params: { status?: number; sort?: number; page?: number; size?: number }) {
    return super.$get('/public/notices', { params });
  }

  /**
   * 获取公告
   * http://v1.api.example.com/internal/notices/{notice-id}
   * @param notice_id
   * @returns
   */
  notice(notice_id: ID) {
    return super.$get(`/internal/notices/${notice_id}`);
  }

  /**
   * 获取公告管理详情
   * http://v1.api.example.com/public/notices/{notice-id}
   * @param notice_id
   * @returns
   */
  getNoticeManage(notice_id: ID) {
    return super.$get(`/public/notices/${notice_id}`);
  }

  /**
   * 标记公告已读
   * http://v1.api.example.com/internal/members/current/notices/{notice-id}/read
   * @param notice_id
   * @returns
   */
  read(notice_id: ID) {
    return super.$post(`/internal/members/current/notices/${notice_id}/read`);
  }

  /**
   * 审核公告
   * http://192.168.6.120:3100/mock/254/public/notices/{id}/audit
   * @param notice_id
   * @returns
   */
  postAuditNotice(notice_id: ID, data: { pass: true; body: string }) {
    return super.$post(`/public/notices/${notice_id}/audit`, data);
  }

  /**
   * 上线公告
   * http://192.168.6.120:3100/mock/254/public/notices/{id}/unpublish
   * @param notice_id
   * @returns
   */
  postPublishNotice(notice_id: ID) {
    return super.$post(`/public/notices/${notice_id}/publish`);
  }

  /**
   * 下线公告
   * http://192.168.6.120:3100/mock/254/public/notices/{id}/unpublish
   * @param notice_id
   * @returns
   */
  postUnpublishNotice(notice_id: ID) {
    return super.$post(`/public/notices/${notice_id}/unpublish`);
  }

  /**
   * 删除公告
   * http://192.168.6.120:3100/mock/254/public/notices/{id}
   * @param notice_id
   * @returns
   */
  deleteNotice(notice_id: ID) {
    return super.$delete(`/public/notices/${notice_id}`);
  }
}
