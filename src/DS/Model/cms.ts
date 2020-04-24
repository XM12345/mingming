import BaseModel from './baseModel';
type ID = number | string;

class PrivateApi extends BaseModel {
  baview_token: string;
  get headers() {
    return { 'X-CSRF-Token': this.baview_token };
  }
  constructor(basePath: string, baview_token: string) {
    super(basePath);
    this.baview_token = baview_token;
  }
  /* 统计 */
  countStat({
    column,
    start,
    stop,
    types = 'default,video,special,vote,pictureset,questionnaire,show,banner'
  }: any = {}) {
    // 获取内容数量统计
    // http://v1.api.example.com/private/stat/contents/count-stat?column={栏目id,0或不传统计全部}&start={开始日期}&stop={结束日期}&types={内容类型,多个,分隔}
    let params = { column, start, stop, types };
    return super.$get('/private/stat/contents/count-stat', { params, headers: this.headers });
  }
  types(types: string, { column, start = '', stop = '' }: any = {}) {
    // 获取内容类型天统计
    // http://v1.api.example.com/private/stat/contents/types/{types,多个,分隔}/date-stat?column={栏目id,0或不传统计全部}&start={开始日期}&stop={结束日期}
    let params = { column, start, stop };
    return super.$get(`/private/stat/contents/types/${types}/date-stat`, { params, headers: this.headers });
  }
  viewRank({ count = 10 } = {}) {
    // 获取阅读量内容排行
    // http://v1.api.example.com/private/stat/contents/view-count/rank?count={数量,默认为10}
    let params = { count };
    return super.$get('/private/stat/contents/view-count/rank', { params, headers: this.headers });
  }
  columnRank({ count = 10 } = {}) {
    // 获取栏目内容数排行
    // http://v1.api.example.com/private/stat/columns/contents/rank?count={数量,默认为10}
    let params = { count };
    return super.$get('/private/stat/columns/contents/rank', { params, headers: this.headers });
  }
  userRank({ count = 10 } = {}) {
    // 获取用户内容数排行
    // http://v1.api.example.com/private/stat/users/contents/rank?count={数量,默认为10}
    let params = { count };
    return super.$get('/private/stat/users/contents/rank', { params, headers: this.headers });
  }
}

export default class Clue extends BaseModel {
  createPrivate(baview_token: string) {
    return new PrivateApi(super.$basePath, baview_token);
  }
  async content(content_id: ID) {
    // http://v1.api.example.com/public/v2/contents/{content-id}
    let data = await super.$get(`/public/v2/contents/${content_id}`);
    data.body_components = await this.bodyComponents(data.body_components);
    return data;
  }
  // 获取预览内容
  async contentPreview(content_preview_id: string) {
    let data = await super.$get(`/public/contents/preview/${content_preview_id}`);
    data.body_components = await this.bodyComponents(data.body_components);
    return data;
  }
  async bodyComponents(body_components: Record<string, any[] | null>) {
    if (body_components && Object.values(body_components).some(v => !!(v && v.length))) {
      try {
        let components_data = await super.$post('/public/body-components', body_components);
        return components_data;
      } catch (error) {
        console.warn(error);
      }
    }
    return {};
  }
  videos(ids: ID[]) {
    // 批量获取视频 旧
    return super.$get('/public/videos/' + ids);
  }
  picturesets(ids: ID[]) {
    // 批量获取图组 旧
    return super.$get('/public/picturesets/' + ids);
  }
}
