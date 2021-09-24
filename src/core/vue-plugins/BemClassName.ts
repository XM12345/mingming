import type Vue from 'vue';
import { createVuePlugin } from '@/core/utils/createVuePlugin';

function createBemClassName(this: Vue, ...ems: string[]) {
  let b = this.$options.name;
  if (!ems.length) {
    ems.push('');
  }
  return ems
    .filter(v => typeof v == 'string')
    .map(em => b + em)
    .join(' ');
}

export default createVuePlugin((Vue, config) => {
  Vue.prototype.B = createBemClassName;
});

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * 生成class名称
     * @example
     * B() => 'component'
     * B('__header') => 'component__header'
     * B('__header', '__header--default') => 'component__header component__header--default'
     * B('__header', (active=true) && '--active') => 'component__header component--active'
     */
    B: typeof createBemClassName;
  }
}
