import _Vue from 'vue/types';
import { VueConstructor } from 'vue/types';

let components: Record<string, VueConstructor<_Vue>> = {};
let requireComponent = require.context('./', true, /\.vue$/); // 相对路径，true为是否查询子目录，匹配文件名的正则表达式

requireComponent.keys().forEach(filename => {
  let componentName = filename.replace(/(\.\/|\.vue)/g, '').replace(/\//g, '--');
  let componentConfig = requireComponent(filename).default;
  components[componentName] = componentConfig;
});
export default components;
