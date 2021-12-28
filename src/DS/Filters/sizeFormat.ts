export default function ds_size(byte: number) {
  let M: number | string = byte / 1024 / 1024;
  if (M >= 1024) {
    let G = (M / 1024).toFixed(2);
    return G + 'G';
  } else {
    M = M.toFixed(2);
    return M + 'M';
  }
}
