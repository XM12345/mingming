let sWidth = window.innerWidth;

/**
 * 图片URL加尺寸后缀
 * src 源地址
 * size = 5, Number: 宽度百分比，String: 预设尺寸
 * ratio = 0,  高宽比
 */
// 高度自适应
export default function ds_image(src = '', size = 5, ratio = 0) {
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
