import BaseModel from './baseModel';
type ID = number | string;

export default class Clue extends BaseModel {
  async content(content_id: ID) {
    // http://v1.api.example.com/public/v2/contents/{content-id}
    let data = await super.$get(`/v2/contents/${content_id}`);
    data.body_components = await this.bodyComponents(data.body_components);
    return data;
  }
  async bodyComponents(body_components: Record<string, any[] | null>) {
    if (body_components && Object.values(body_components).some(v => !!(v && v.length))) {
      try {
        let components_data = await super.$post('/body-components', body_components);
        return components_data;
      } catch (error) {
        console.warn(error);
      }
    }
    return {};
  }
  videos(ids: ID[]) {
    // 批量获取视频 旧
    return super.$get('/videos/' + ids);
  }
  picturesets(ids: ID[]) {
    // 批量获取图组 旧
    return super.$get('/picturesets/' + ids);
  }
}
