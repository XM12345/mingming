import BaseModel from './baseModel';
type ID = number | string;

export default class Subjects extends BaseModel {
  follow(type = 1) {
    // 获取用户关注栏目列表
    // http://v1.api.domain.com/internal/users/current/follow/columns?type={type}
    let params = { type };
    return super.$get('/users/current/follow/columns', { params });
  }
  getColumns() {
    // 获取用户关注栏目列表（数据转换）
    let children: any = {};
    return this.follow().then(data => {
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
  postFollow(column_id: ID, data: Object) {
    // 设置用户关注栏目
    // http://v1.api.domain.com/internal/users/current/follow/columns/{column-id}
    /* {
	    "type":<int|关注类型：1-新文稿/串联单>,
	    "is_follow":<bool|是否关注>
    } */
    return super.$post(`/users/current/follow/columns/${column_id}`, data);
  }

  message(app: string) {
    // 获取用户消息通知类型
    // http://v1.api.domain.com/internal/users/current/message/{app}/types
    return super.$get(`/users/current/message/${app}/types`);
  }

  postMessage(app: string, data: ID[]) {
    // 设置用户消息通知类型
    // http://v1.api.domain.com/internal/users/current/message/{app}/types
    /* [
      <int|消息通知类型ID>,
      …
    ] */
    return super.$post(`/users/current/message/${app}/types`, data);
  }
  subjects(page = 1, { col, name, status, dstatus, creator, start, stop, size = 20 }: any = {}) {
    // 选题列表
    // http://v1.api.domain.com/internal/subjects?page={page}&size={size}&col={col}&name={name}&status={status}&dstatus={dstatus}&creator={creator}&start={start}&stop={stop}
    let params = { page, size, col, name, status, dstatus, creator, start, stop };
    return super.$get('/subjects', { params });
  }
  subject(subject_id: ID) {
    // 选题详情
    // http://v1.api.domain.com/internal/subjects/{subject-id}
    return super.$get(`/subjects/${subject_id}`);
  }

  operlog(subject_id: ID) {
    // 操作纪录
    // http://v1.api.domain.com/internal/subjects/{subject-id}/operlog
    return super.$get(`/subjects/${subject_id}/operlog`);
  }
  tasks(subject_id: ID) {
    // 选题任务列表
    // http://v1.api.domain.com/internal/subjects/{subject-id}/tasks
    return super.$get(`/subjects/${subject_id}/tasks`);
  }

  atts(subject_id: ID) {
    // 选题附件列表
    // http://v1.api.domain.com/internal/subjects/{subject-id}/atts
    return super.$get(`/subjects/${subject_id}/atts`);
  }
  comments(subject_id: ID) {
    // 批注列表
    // http://v1.api.domain.com/internal/subjects/{subject-id}/comments
    return super.$get(`/subjects/${subject_id}/comments`);
  }

  task(task_id: ID) {
    // 任务详情
    // http://v1.api.domain.com/internal/tasks/{task-id}
    return super.$get(`/tasks/${task_id}`);
  }

  accept(task_id: ID) {
    // 接受任务
    // http://v1.api.domain.com/internal/tasks/{task-id}/accept
    return super.$post(`/tasks/${task_id}/accept`);
  }

  task_comments(task_id: ID) {
    // 任务批注列表
    // http://v1.api.domain.com/internal/tasks/{task-id}/comments
    return super.$get(`/tasks/${task_id}/comments`);
  }
  task_logs(task_id: ID) {
    // 任务操作纪录
    // http://v1.api.domain.com/internal/tasks/{task-id}/logs
    return super.$get(`/tasks/${task_id}/logs`)
  }
}
