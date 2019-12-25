import Vue from 'vue';
import Filters from './Filters';

// 加载组件Components
import Components from './Components';

Object.entries(Components).forEach(([name, component]) => {
  Vue.component(name, component);
  Vue.component(name);
});

// 注册 Filters
Object.keys(Filters).forEach(k => {
  Vue.filter(k, Filters[k]);
});

export default {};
