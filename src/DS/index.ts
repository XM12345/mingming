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
Vue.use(Filters);

Object.entries(Components).forEach(([name, component]) => {
  Vue.component(name, component);
  Vue.component(name);
});

regVueComponents(BaseComponentPackage, Vue);

export default {};
