import Vue from 'vue';
import Site from './site_极速融通';

if (Site.componentsContext) {
  // 注册全局组件
  let requireComponent = Site.componentsContext;
  requireComponent.keys().forEach(filename => {
    let componentName = filename.replace(/(\.\/|\.vue)/g, '').replace(/\//g, '--');
    let componentConfig = requireComponent(filename).default;
    Vue.component(
      componentName,
      // 如果这个组件选项是通过 `export default` 导出的，
      // 那么就会优先使用 `.default`，否则回退到使用模块的根。
      componentConfig.default || componentConfig
    );
  });
}
declare global {
  interface Window {
    app: any;
    site_: typeof Site;
  }
}
window.site_ = Site;
window.app = Site;


export default Site;
