import BaseModel from './baseModel';
type ID = number | string;

export default class Clue extends BaseModel {
  async tree() {
    // 获取可见栏木树
    // http://v1.api.example.com/internal/users/column/tree
    let data = await super.$get('/users/column/tree');
    let follow_data = await this.follow();
    let follow_ids = follow_data.map((item: any) => item.id) || [];
    return this.getChildren(data, follow_ids);
  }
  getChildren(data: any, ids: ID[]) {
    data.forEach((item: any) => {
      let { id, children } = item;
      item.isFolder = true;
      item.is_follow = false;
      if (ids.includes(id)) {
        item.is_follow = true;
      }
      if (children.length) {
        this.getChildren(children, ids);
      }
    });
    return data;
  }

  follow() {
    // 获取我关注的栏目
    // http://v1.api.example.com/internal/users/columns/follow
    return super.$get('/users/columns/follow');
  }

  postFollow(data: ID[]) {
    // 设置我关注的栏目
    // http://v1.api.example.com/internal/users/columns/follow
    /* [ <long, 栏目ID1>, <long, 栏目ID2>, …… ] */
    return super.$post('/users/columns/follow', data);
  }
  clue(clue_id: ID) {
    // 我的稿件详情
    // http://v1.api.example.com/internal/clues/{clue-id}
    return super.$get(`/clues/${clue_id}`);
  }

  common(clue_id: ID) {
    // 公共稿件详情
    // http://v1.api.example.com/internal/common/clues/{clue-id}
    return super.$get(`/common/clues/${clue_id}`);
  }

  recyclebin(clue_id: ID) {
    // 回收站稿件详情
    // http://v1.api.example.com/internal/recyclebin/clues/{clue-id}
    return super.$get(`/recyclebin/clues/${clue_id}`);
  }

  postils(clue_id: ID) {
    // 稿件批注
    //  http://v1.api.example.com/internal/clues/{clue-id}/postils
    return super.$get(`/clues/${clue_id}/postils`);
  }
}
