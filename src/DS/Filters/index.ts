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
function dateHandle(date: Date) {
  let dif_s = (Date.now() - date.getTime()) / 1000;
  let dif_m = Math.floor(dif_s / 60);
  let dif_h = Math.floor(dif_m / 60);
  let dif_d = Math.floor(dif_h / 24);

  if (dif_s >= 0) {
    if (dif_m <= 3) {
      return '刚刚';
    } else if (dif_m < 60) {
      return dif_m + '分钟前';
    } else if (dif_h < 24) {
      return dif_h + '小时前';
    } else if (dif_d < 3) {
      return dif_d + '天前';
    } else if (date.getFullYear() == CURRENT_YEAR) {
      return dateFormat(date, 'MM-dd hh:mm');
    } else {
      return dateFormat(date, 'yyyy-MM-dd hh:mm');
    }
  } else {
    return dateFormat(date, 'yyyy/MM/dd');
  }
}
function ds_time(timestamp: number | string | Date, format = '') {
  if (!timestamp) {
    return '';
  }
  if (typeof timestamp == 'number') {
    timestamp = timestamp * 1000;
  }
  let date = new Date(timestamp);
  return format ? dateFormat(date, format) : dateHandle(date);
}

let Filters: Record<string, Function> = { ds_size, ds_time };
export default Filters;
