import BaseModel from './baseModel';
type ID = number | string;

export default class Stream extends BaseModel {
  columns() {
    // 获取播出栏目信息列表
    // http://v1.api.example.com/public/columns
    return super.$get('/columns');
  }
  putColumns(ids: ID) {
    // 设置当前用户关注的栏目
    // http://v1.api.example.com/public/columns/{id,string多个栏目ID逗号分隔}/follow
    return super.$put(`/columns/${ids}/follow`);
  }
  follow() {
    // 获取用户当前关注的栏目列表
    // http://v1.api.example.com/ public/columns/follow
    return super.$get('/columns/follow');
  }
  async getColumns() {
    let columns = await this.columns();
    let follow = await this.follow();
    let children: any = {};
    columns.forEach((item: any) => {
      let { parent_id, id } = item;
      item.is_follow = false;
      children[id] = children[id] || [];
      if (parent_id) {
        children[parent_id] = children[parent_id] || [];
        children[parent_id].push(item);
      }

      follow.forEach((el: any) => {
        if (id == el) {
          item.is_follow = true;
        }
      });
    });
    let contents = columns.map((item: any) => {
      item.children = children[item.id];
      item.isFolder = true;
      return item;
    });
    return contents;
  }
}
