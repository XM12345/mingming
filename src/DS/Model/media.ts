import BaseModel from './baseModel';
type ID = number | string;

export default class Media extends BaseModel {
  columns() {
    // 获取可浏览的栏目列表
    // http://v1.api.domain.com/internal/columns
    return super.$get('/columns');
  }
  attention_columns() {
    // 获取关注的栏目列表
    // http://v1.api.domain.com/internal/users/current/attentioned/columns
    return super.$get('/users/current/attentioned/columns');
  }
  getColumns() {
    let children: any = {};
    return this.columns().then(data => {
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
        item.is_follow = item.attentioned;
        return item;
      });
      return contents;
    });
  }

  attention(column_id: ID) {
    // 关注栏目
    // http://v1.api.domain.com/internal/columns/{cloumn-id,多个逗号分离}/attention
    return super.$post(`/columns/${column_id}/attention`);
  }

  configs() {
    // 获取任务消息配置
    // http://v1.api.domain.com/internal/task/message/configs
    /* "type": <string, 任务消息类型。media_upload、上传相关，media_download、下载相关，media_send、推送相关，media_nle_task、非编相关> */
    return super.$get('/task/message/configs');
  }

  putConfigs(data: any[] = []) {
    // 修改任务消息配置
    // http://v1.api.domain.com/internal/task/message/configs

    /* [
      {
          "state": <int, 状态0、关闭；1、开启>,
          "type": <string, 任务消息类型。media_upload、上传相关，media_download、下载相关，media_send、推送相关，media_nle_task、非编相关>
      },
      ......
    ]
  
     type不可缺失 */
    return super.$put('/task/message/configs', data);
  }

  medias({ type, keyword, start, stop, folder, column }: any = {}) {
    // 获取素材列表
    //  http://v1.api.domain.com/internal/media?type=<类型,不传获取全部>&keyword=<搜索关键字>&start=<创建时间开始时间>&stop=<创建时间结束时间>&folder=<文件夹,0-根目录>&column=<栏目id>
    let params = { type, keyword, start, stop, folder, column };
    return super.$get('/media', { params });
  }
  myMedia({ type, keyword, start, stop, folder }: any = {}) {
    // 获取我的素材列表
    // http://v1.api.domain.com/internal/users/current/media?type=<类型,不传获取全部>&keyword=<搜索关键字>&start=<创建时间开始时间>&stop=<创建时间结束时间>&folder=<文件夹,0-根目录>
    let params = { type, keyword, start, stop, folder };
    return super.$get('/users/current/media', { params });
  }
  media(medium_id: ID) {
    // 获取素材详情
    // http://v1.api.domain.com/internal/media/{medium-id}
    return super.$get(`/media/${medium_id}`);
  }
  correlation(medium_id: ID) {
    // 获取关联素材
    //  http://v1.api.domain.com/internal/media/correlation/{medium-id}
    return super.$get(`/media/correlation/${medium_id}`);
  }
  logs(medium_id: ID, page = 1, { type, size = 20 }: any = {}) {
    // 获取素材操作纪录
    // http://v1.api.domain.com/internal/media/{medium-id}/logs?type = <int, 操作类型，0或缺省取全部>& page=<分页索引，从1开始>&size=<分页大小>
    let params = { type, page, size };
    return super.$get(`/media/${medium_id}/logs`, { params });
  }

  download(data: Object) {
    // 下载素材
    // http://v1.api.domain.com/internal/media/download
    // 请求内容： { <long, 素材id> : <string, 版本>,…… }
    return super.$post('/media/download', data);
  }

  collections(medium_id: ID) {
    // 收藏素材
    // http://v1.api.domain.com/internal/collections/{medium-id, 素材id}
    return super.$put(`/collections/${medium_id}`);
  }
}
