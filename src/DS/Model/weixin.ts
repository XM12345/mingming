import BaseModel from './baseModel';
type ID = number | string;

export default class Weixin extends BaseModel {
  // 用户消息
  messages(page = 1, { read = 0, size = 20 }: any = {}) {
    // 获取消息列表
    // http://v1.api.domain.com/internal/users/messages?page={page}&size={size}&read={read}
    // read:已读状态，默认0：0-全部，1-已读，2-未读
    let params = { page, size, read };
    return super.$get('/users/messages', { params });
  }
  readed(data: Array<any>) {
    // 标记已读
    // http://v1.api.domain.com/internal/users/messages
    /* [
      <long|消息ID1>,
      ...
    ] */
    return super.$post('/users/messages', data);
  }
  allReaded() {
    // 标记全部已读
    // http://v1.api.domain.com/internal/users/messages/all
    return super.$post('/users/messages/all');
  }

  deleteMes(msg_ids: ID) {
    // 删除消息
    // http://v1.api.domain.com/internal/users/messages/{msg-id1},{msg-id2}...
    return super.$delete(`/users/messages/${msg_ids}`);
  }
  deleteAllMes() {
    // 删除全部消息
    // http://v1.api.domain.com/internal/users/messages/all
    return super.$delete('/users/messages/all');
  }

  // 公众号相关
  accounts() {
    // 获取公众号列表
    // http://v1.api.domain.com/internal/accounts
    return super.$get('/accounts');
  }
  uploader() {
    // 获取上传地址
    // http:// v1.api.domain.com/internal/uploader
    return super.$get('/uploader');
  }

  // 群发管理
  contents(account_id: ID, page = 1, { status = -1, keyword, size = 8 }: any = {}) {
    // 获取群发列表
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents?page={page}&size={size}&status={status}&keyword={keyword}&start={start}&stop={stop}&order={order}
    // state默认-1：-1-全部，0-草稿，1-一审，2-二审，3-三审，9-待审，10-通过，11-入库，12-已发布，13-发布失败
    let params = { page, status, size, keyword };
    return super.$get(`/accounts/${account_id}/contents`, { params });
  }

  content(account_id: ID, content_id: ID) {
    // 获取群发图文
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}
    return super.$get(`/accounts/${account_id}/contents/${content_id}`);
  }
  comments(account_id: ID, content_id: ID) {
    // 获取图文批注
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/comments
    return super.$get(`/accounts/${account_id}/contents/${content_id}/comments`);
  }

  addComments(account_id: ID, content_id: ID, data: String) {
    // 添加批注
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/comments
    return super.$post(`/accounts/${account_id}/contents/${content_id}/comments`, data);
  }
  logs(account_id: ID, content_id: ID) {
    // 获取操作日志
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/logs
    return super.$get(`/accounts/${account_id}/contents/${content_id}/logs`);
  }

  status(account_id: ID, content_id: ID) {
    // 获取可撤销\退回状态
    // http://v1.api.domain.com/internal/contents/revoke/status
    return super.$get(`/accounts/${account_id}/contents/${content_id}/revoke/status`);
  }
  revoke(account_id: ID, content_id: ID, data: Number) {
    // 撤销群发
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/revoke
    /* <int|目标状态> */
    return super.$put(`/accounts/${account_id}/contents/${content_id}/revoke`, data);
  }
  audit(account_id: ID, content_id: ID, data: Object) {
    // 审核群发
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/audit
    /* {
      "is_approved":<bool|审核是否通过>,
      "comment":<string|审核意见>,
      <!--审核退回时有效-->
      "status":<int|退回文稿状态>
    } */
    return super.$post(`/accounts/${account_id}/contents/${content_id}/audit`, data);
  }
  delete(account_id: ID, content_ids: ID) {
    // 删除到回收站
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{contenet-id1},{content-id2}...
    return super.$delete(`/accounts/${account_id}/contents/${content_ids}`);
  }
  publish(account_id: ID, content_id: ID, data: Object) {
    // 发布群发
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/publish
    /* {
      "accounts":[
        <long|微信公众号ID1>,
        <long|微信公众号ID2>,
        ...
      ],
      "send_time":<timestamp|发布时间，可精确到小时，为0则立即发布>
    } */
    return super.$post(`/accounts/${account_id}/contents/${content_id}/publish`, data);
  }

  commit(account_id: ID, content_id: ID) {
    // 提交群发
    // http://v1.api.domain.com/internal/accounts/{account-id}/contents/{content-id}/commit
    return super.$post(`/accounts/${account_id}/contents/${content_id}/commit`);
  }
}
