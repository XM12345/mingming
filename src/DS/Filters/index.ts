let sWidth = window.innerWidth;
function ds_size(byte: any) {
  let M: number | string = byte / 1024 / 1024;
  if (M >= 1024) {
    let G = (M / 1024).toFixed(2);
    return G + 'G';
  } else {
    M = M.toFixed(2);
    return M + 'M';
  }
}

/* 
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
function ds_time(timestamp: number | string | Date, format = '', des = '') {
  if (!timestamp) {
    return '';
  }
  if (typeof timestamp == 'number') {
    timestamp = timestamp * 1000;
  }
  let date = new Date(timestamp);
  return format ? dateFormat(date, format) : dateHandle(date, des);
}

/**
 * 图片URL加尺寸后缀
 * src 源地址
 * size = 5, Number: 宽度百分比，String: 预设尺寸
 * ratio = 0,  高宽比
 */
// 高度自适应
function ds_image(src = '', size = 5, ratio = 0) {
  // 默认头像处理
  let width;
  if (typeof size == 'number') {
    width = ((sWidth * size) / 100) | 0; // n | 0;取整
  } else {
    width = {
      C: 40,
      S: (sWidth / 3) | 0,
      M: (sWidth / 2) | 0,
      L: sWidth
    }[size];
  }
  // width = width * 1.5 | 0;
  let height = (width * ratio) | 0;
  let size_fit = height ? 3 : 2; //  [ 1.min; 2.fill; 3.cover; 4.contain]
  let size_str = `w=${width || 180}&h=${height}&s=${size_fit}`;
  // TODO http 判断
  if (src) {
    return src + (src.indexOf('?') == -1 ? '?' : '&') + size_str;
  } else {
    // return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    return 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
  }
}

let Filters: Record<string, Function> = { ds_size, ds_time, ds_image };
export default Filters;
