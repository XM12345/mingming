function toHump(word: string) {
  return word.replace(/\_(\w)/g, function (result, letter) {
    return letter.toUpperCase();
  });
}
function toUnderline(word: string) {
  return word.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 驼峰(hump)、下划线(underline)相互转换
 * @example statusName <=> status_name
 *
 */
export default function humpUnderlineFormat(word: string, type: 'hump' | 'underline' = 'underline') {
  return type == 'hump' ? toHump(word) : toUnderline(word);
}
