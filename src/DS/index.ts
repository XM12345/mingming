import Vue from 'vue';
import { regVueComponents } from '@/core/utils/loadVueComponents';
// 加载组件Components
import Components from './Components';
import { BaseComponentPackage } from './baseComponents';
Object.entries(Components).forEach(([name, component]) => {
  Vue.component(name, component);
  Vue.component(name);
});
regVueComponents(BaseComponentPackage, Vue);
export { install } from './install';
