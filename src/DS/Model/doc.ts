import BaseModel from './baseModel';
type ID = number | string;

export default class Doc extends BaseModel {
  async columns(pk: any) {
    // 获取所有栏目
    // http://v1.api.domain.com/internal/columns?pk={permission-key1},{permission-key2}...
    let params = { pk };
    let data = await super.$get('/columns', { params });
    let children: any = {};
    data.forEach((item: any) => {
      let { parent_id } = item;
      children[item.id] = children[item.id] || [];
      if (parent_id) {
        children[parent_id] = children[parent_id] || [];
        children[parent_id].push(item);
      }
    });
    let contents = data.map((item: any) => {
      item.children = children[item.id];
      item.isFolder = true;
      return item;
    });
    return contents;
  }

  async follow(app: string, pk: string, type = 1) {
    // 获取用户关注栏目列表
    // http://v1.api.domain.com/internal/users/current/follow/columns/{app}?type={type}
    let columns = await super.$get(`/users/current/follow/columns/${app}`, { params: { type } });
    let root_columns = await super.$get('/columns', { params: { pk } });
    root_columns.map((item: any) => {
      item.is_follow = false;
      columns.forEach((i: any) => {
        if (i.id == item.id && i.is_follow == true) {
          item.is_follow = true;
        }
      });
      return item;
    });
    return root_columns;
  }

  getColumns(app: string, pk = 'doc.view') {
    // 获取用户关注栏目列表（数据转换）
    let children: any = {};
    return this.follow(app, pk).then(data => {
      data.forEach((item: any) => {
        let { parent_id } = item;
        children[item.id] = children[item.id] || [];
        if (parent_id) {
          children[parent_id] = children[parent_id] || [];
          children[parent_id].push(item);
        }
      });
      let contents = data.map((item: any) => {
        item.children = children[item.id];
        item.isFolder = true;
        return item;
      });
      return contents;
    });
  }
  postFollow(column_id: ID, app: string, data: Object) {
    // 设置用户关注单栏目
    // http://v1.api.domain.com/internal/users/current/follow/columns/{column-id}/{app}
    /* {
	     "type":<int|关注类型：1-新文稿/串联单>,
	     "is_follow":<bool|是否关注>
    } */
    return super.$post(`/users/current/follow/columns/${column_id}/${app}`, data);
  }
  status(col_id: ID) {
    // 获取栏目节点状态列表
    // http://v1.api.domain.com/internal/columns/{col-id}/status
    return super.$get(`/columns/${col_id}/status`);
  }

  message(app: string) {
    // 获取消息通知类型
    // http://v1.api.domain.com/internal/users/current/message/{app}/types
    return super.$get(`/users/current/message/${app}/types`);
  }

  postMessage(app: string, data: ID[]) {
    // 设置用户消息通知类型
    // http://v1.api.domain.com/internal/users/current/message/{app}/types
    return super.$post(`/users/current/message/${app}/types`, data);
  }

  seriesList(page = 1, { col = '', status = -1, name = '', size = 30 }: any = {}) {
    // 串联单列表
    // http://v1.api.domain.com/internal/series?page={page}&size={size}&col={col}&name={name}&status={status}&creator={creator}&user={user}&start={start}&stop={stop}&planstart={planstart}&planstop={planstop}&playstart={playstart}&playstop={playstop}
    let params = { page, col, status, name, size };
    return super.$get('/series', { params });
  }
  seriesMine(page = 1, { col = '', status = -1, name = '', size = 30 }: any = {}) {
    // 我的串联单
    // http://v1.api.domain.com/internal/series/mine?page={page}&size={size}&col={col-id}&name={name}&status={status}&start={start}&stop={stop}&planstart={planstart}&planstop={planstop}&playstart={playstart}&playstop={playstop}
    let params = { page, col, status, name, size };
    return super.$get('/series/mine', { params });
  }
  series(series_id: ID) {
    // 串联单详情
    // http://v1.api.domain.com/internal/series/{series-id}
    return super.$get(`/series/${series_id}`);
  }
  audit(page = 1, { col = '', status = -1, name = '', size = 30 }: any = {}) {
    // 待审列表
    // http://v1.api.domain.com/internal/series/audit?page={page}&size={size}&col={col}&name={name}&status={status}&creator={creator}&start={start}&stop={stop}&planstart={planstart}&planstop={planstop}&playstart={playstart}&playstop={playstop}
    let params = { page, col, status, name, size };
    return super.$get('/series/audit', { params });
  }
  revoke_status(series_id: ID) {
    // 获取可撤销、可退回状态
    // http://v1.api.domain.com/internal/series/{series-id}/revoke/status
    return super.$get(`/series/${series_id}/revoke/status`);
  }
  post_audit(series_id: ID, data: Object) {
    // 串联单审核
    // http://v1.api.domain.com/internal/series/{series-id}/audit
    //{
    //"is_approved":<bool|审核是否通过>,
    //"comment":<string|审核意见>,
    //<!--审核退回时有效-->
    //"status":<int|退回文稿状态>
    //}
    return super.$post(`/series/${series_id}/audit`, data);
  }
  revoke(series_id: ID, data: Object) {
    // 撤销串联单
    // ???
    // http://v1.api.domain.com/internal/docs/{doc-id}/revoke
    return super.$put(`/series/${series_id}/revoke`, data);
  }
  series_comments(series_id: ID) {
    // 获取串联单批注列表
    // http://v1.api.domain.com/internal/series/{series-id}/comments
    return super.$get(`/series/${series_id}/comments`);
  }
  series_addComments(series_id: ID, data: String) {
    // 添加批注
    // http://v1.api.domain.com/internal/series/{series-id}/comments
    return super.$post(`/series/${series_id}/comments`, data);
  }

  delete_series(series_ids: ID) {
    // 串联单删除
    // http://v1.api.domain.com/internal/series/{series-id1},{series-id2}...
    return super.$delete(`/series/${series_ids}`);
  }

  commit(series_id: ID) {
    // 提交串联单
    // http://v1.api.domain.com/internal/series/{series-id}/commit
    return super.$post(`/series/${series_id}/commit`);
  }
  recycle(page = 1, { name = '', size = 30 }: any = {}) {
    // 回收站列表
    // http://v1.api.domain.com/internal/series/recycle?page={page}&size={size}&name={name}
    let params = { page, name, size };
    return super.$get('/series/recycle', { params });
  }
  restore(data: Array<any>) {
    // 批量还原
    // http://v1.api.domain.com/internal/series/recycle/restore
    /*  [
      <long|串联单ID1>,
      ...
    ] */
    return super.$post('/series/recycle/restore', data);
  }

  delFinal(series_ids: ID) {
    // 批量删除
    // http://v1.api.domain.com/internal/series/recycle/{series-id1},{series-id2}...
    return super.$delete(`/series/recycle/${series_ids}`);
  }

  delete_recycle(series_ids: ID) {
    // 批量删除
    // http://v1.api.domain.com/internal/series/recycle/{series-id1},{series-id2}..
    return super.$delete(`/series/recycle/${series_ids}`);
  }

  clear() {
    // 清空回收站
    // http://v1.api.domain.com/internal/series/recycle/clear
    return super.$post('/series/recycle/clear');
  }

  doc(doc_id: ID) {
    // 文稿详情
    // http://v1.api.domain.com/internal/docs/{doc-id}
    return super.$get(`/docs/${doc_id}`);
  }

  attachments(doc_id: ID) {
    // 获取文稿附件列表
    // http://v1.api.domain.com/internal/docs/{doc-id}/attachments?use_type={use_type}&format={format}
    return super.$get(`/docs/${doc_id}/attachments`);
  }

  auditlog(doc_id: ID) {
    // 文稿审核记录
    // http://v1.api.domain.com/internal/docs/{doc-id}/auditlog
    return super.$get(`/docs/${doc_id}/auditlog`);
  }

  operlog(doc_id: ID) {
    // 文稿操作纪录
    // http://v1.api.domain.com/internal/docs/{doc-id}/operlog
    return super.$get(`/docs/${doc_id}/operlog`);
  }

  histories(doc_id: ID) {
    // 文稿历史版本列表
    // http://v1.api.domain.com/internal/docs/{doc-id}/histories
    return super.$get(`/docs/${doc_id}/histories`);
  }

  history(doc_id: ID, ver: any) {
    // 文稿历史版本内容
    // http://v1.api.domain.com/internal/docs/{doc-id}/histories/{ver}
    return super.$get(`/docs/${doc_id}/histories/${ver}`);
  }
  compare(doc_id: ID, ver: any) {
    // 文稿比对
    // http://v1.api.domain.com/internal/docs/{doc-id}/compare/{ver}
    return super.$get(`/docs/${doc_id}/compare/${ver}`);
  }

  docs_comments(doc_id: ID) {
    // 获取批注列表
    // http://v1.api.domain.com/internal/docs/{doc-id}/comments
    return super.$get(`/docs/${doc_id}/comments`);
  }
  docs_addComments(doc_id: ID, data: String) {
    // 文稿添加批注
    // http://v1.api.domain.com/internal/docs/{doc-id}/comments
    return super.$post(`/docs/${doc_id}/comments`, data);
  }
}
