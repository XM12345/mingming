import Vue from 'vue';
import Filters from './Filters';
import { regVueComponents } from '@/core/utils/loadVueComponents';
import BemClassName from '@/core/vue-plugins/BemClassName';

// 加载组件Components
import Components from './Components';
import baseThirdComponents from './baseThirdComponents';
import { BaseComponentPackage } from './baseComponents';

Vue.use(baseThirdComponents);
Vue.use(BemClassName);

Object.entries(Components).forEach(([name, component]) => {
  Vue.component(name, component);
  Vue.component(name);
});

regVueComponents(BaseComponentPackage, Vue);

// 注册 Filters
Object.keys(Filters).forEach(k => {
  Vue.filter(k, Filters[k]);
});

export default {};
