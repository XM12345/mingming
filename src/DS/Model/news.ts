import BaseModel from './baseModel';
type ID = number | string;

export default class News extends BaseModel {
  news(id: ID) {
    // 获取新闻详情
    // http://v1.api.domain.com/public/news/{id}
    return super.$get(`/news/${id}`);
  }

  topic(id: ID) {
    // 生成选题
    // http://v1.api.domain.com/public/news/{id}/topic
    return super.$post(`/news/${id}/topic`);
  }

  copy(id: ID) {
    // 生成通稿
    // http://v1.api.domain.com/public/news/{id}/copy
    return super.$post(`/news/${id}/copy`);
  }
}
