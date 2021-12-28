/** 
时间格式
一分钟内：刚刚
一小时内：小时:分钟  更新
今天内：今天  小时:分钟  更新
昨天内：昨天  小时:分钟  更新
今年：月-日  小时:分钟  更新
其他：年-月-日  小时:分钟  更新
公告汇聚将“更新”改为“发布”
消息将“更新”改为“发送”
CMS将“更新”改为“创建”
回收站将“更新”改为“删除”
*/
function dateFormat(date: Date, format = 'MM-dd hh:mm') {
  let map: Record<string, number | undefined> = {
    y: date.getFullYear(),
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    S: date.getMilliseconds() //毫秒,
  };

  return format.replace(/([yMdhmsS])+/g, (all, t) => {
    let value = map[t];
    return value === undefined ? all : (value + '').padStart(all.length, '0').substr(-all.length);
  });
}

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_DATE = new Date().getDate();
function dateHandle(date: Date, des = '') {
  let dif_s = (Date.now() - date.getTime()) / 1000;
  let dif_m = Math.floor(dif_s / 60);
  let dif_h = Math.floor(dif_m / 60);
  let dif_d = Math.floor(dif_h / 24);

  if (dif_s >= 0) {
    if (dif_m <= 1) {
      return '刚刚';
    } else if (dif_m < 60) {
      return `${dateFormat(date, 'hh:mm')} ${des}`;
    } else if (dif_d < 1 && date.getDate() == CURRENT_DATE) {
      return `今天 ${dateFormat(date, 'hh:mm')} ${des}`;
    } else if (dif_d < 2 && date.getDate() == CURRENT_DATE - 1) {
      return `昨天 ${dateFormat(date, 'hh:mm')} ${des}`;
    } else if (date.getFullYear() == CURRENT_YEAR) {
      return `${dateFormat(date, 'MM-dd hh:mm')} ${des}`;
    } else {
      return `${dateFormat(date, 'yyyy-MM-dd hh:mm')} ${des}`;
    }
  } else {
    return dateFormat(date, 'yyyy/MM/dd');
  }
}
export default function ds_time(timestamp: number | string | Date, format = '', des = '') {
  if (!timestamp) {
    return '';
  }
  if (typeof timestamp == 'number') {
    timestamp = timestamp * 1000;
  }
  let date = new Date(timestamp);
  return format ? dateFormat(date, format) : dateHandle(date, des);
}
