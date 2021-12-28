import { createVuePlugin } from '@/core/utils/createVuePlugin';
import sizeFormat from './sizeFormat';
import timeFormat from './timeFormat';
import imageFormat from './imageFormat';

const $F = { size: sizeFormat, time: timeFormat, image: imageFormat };
export default createVuePlugin(Vue => {
  Vue.prototype.$F = $F;
});

declare module 'vue/types/vue' {
  interface Vue {
    $F: typeof $F;
  }
}
