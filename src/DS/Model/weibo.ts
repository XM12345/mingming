import BaseModel from './baseModel';
type ID = Number | String;

export default class Weibo extends BaseModel {
  accounts(operation: string) {
    // 获取可见公众号列表
    // http://v1.api.domain.com/internal/accounts?operation={string,操作权限}
    let params = { operation };
    return super.$get('/internal/accounts', { params });
  }
  authorise(account_id: ID) {
    // 获取公众号授权地址
    // http://v1.api.domain.com/private/accounts/{account-id}/authorise
    return super.$get(`/private/accounts/${account_id}/authorise`);
  }
  articles(page = 1, { state, searchkey, account, size = 20 }: any = {}) {
    // 获取文章列表
    // http://v1.api.domain.com/internal/articles?state=<int, 状态1、审核中，2、审核完成（已通过或无审核流程），3、已发布>&searchtype=<int,搜索类型 0、标题>&searchkey=<string, 搜做关键字>&start=<timestamp, 开始时间>&stop=<timestamp, 日志创建结束时间>&account=<long, 公众号id>
    let params = { page, state, searchkey, account, size };
    return super.$get('/internal/articles', { params });
  }
  article(article_id: ID) {
    // 文章详情
    // http://v1.api.domain.com/internal/articles/{article-id}
    return super.$get(`/internal/articles/${article_id}`);
  }
  postils(article_id: ID) {
    // 获取文章批注
    // http://v1.api.domain.com/internal/articles/{article-id}/postils
    return super.$get(`/internal/articles/${article_id}/postils`);
  }

  addPostils(article_id: ID, data: Object) {
    // 添加批注
    // http://v1.api.domain.com/internal/articles/{article-id}/postils
    /*  {
      "content": <string, 批注内容>, 
    } */
    return super.$post(`/internal/articles/${article_id}/postils`, data);
  }
  auditArticles(article_id: ID) {
    // 获取文章审核详情
    // http://v1.api.domain.com/internal/audit-articles/{article-id}
    return super.$get(`/internal/audit-articles/${article_id}`);
  }
  audit(article_id: ID, data: Object) {
    // 审核文章
    // http://v1.api.domain.com/internal/audit-articles/{article-id}
    /* {
      "pass": <bool, 是否通过审核>, 
      "content": <string, 批注内容>, 
  } */
    return super.$post(`/internal/audit-articles/${article_id}`, data);
  }
  push(article_id: ID, data: Object) {
    // 发布文章
    // http://v1.api.domain.com/internal/articles/{article-id}/push
    /* {
	"account_ids": [<long, 公众号id>,.....],
     } */
    return super.$post(`/internal/articles/${article_id}/push`, data);
  }
  collect(article_id: ID) {
    // 收藏稿件
    // http://v1.api.domain.com/internal/articles/{article-id}/collection
    return super.$post(`/internal/articles/${article_id}/collection`);
  }
  cancel(article_ids: ID) {
    // 取消收藏
    // http://v1.api.domain.com/internal/users/current/articles/{article-ids, 逗号分隔}/collection/cancle
    return super.$post(`/internal/users/current/articles/${article_ids}/collection/cancle`);
  }

  delete(article_id: ID) {
    // 删除文章
    // http://v1.api.domain.com/internal/articles/{article-id}
    return super.$delete(`/internal/articles/${article_id}`);
  }
}
