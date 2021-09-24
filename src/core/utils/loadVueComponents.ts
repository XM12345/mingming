import type Vue from 'vue';
import type { VueConstructor, ComponentOptions, AsyncComponent, FunctionalComponentOptions } from 'vue/types';

function getFileNameFromPath(path: string, optionComponentName?: string) {
  if (optionComponentName) {
    return optionComponentName;
  }
  // let [, name] = path.match(/([^\/]+)\.vue$/i) || [, '']; // 短路径快(10% ~ 50%), 长路径慢(50%), 长文件夹名称慢( ~ 5000%)
  let name = (path.split('/').pop() || '').replace(/\.vue$/i, '');
  return name;
}

function isPromise<T>(value: any): value is Promise<T> {
  return typeof value === 'object' && typeof value.then === 'function' && typeof value.catch === 'function';
}

export type VueComponent = VueConstructor | ComponentOptions<Vue> | FunctionalComponentOptions | AsyncComponent;
export type VueComponentMap = Record<string, VueComponent>;

export function loadVueComponents(
  context: __WebpackModuleApi.RequireContext,
  { getNameFromPath = getFileNameFromPath } = {}
) {
  // console.log(context.id, { context });
  let components: VueComponentMap = {};
  context.keys().forEach(path => {
    let mod = context(path);
    let vueComponent: VueComponent;

    let optionComponentName: string | undefined;
    if (isPromise(mod)) {
      // require.context('./', true, /\.vue$/, 'lazy')
      // TODO: TEST
      // console.log('async', mod);
      vueComponent = () => mod;
    } else {
      if (mod.__esModule) {
        vueComponent = mod.default;
      } else {
        vueComponent = mod;
      }

      if (typeof vueComponent === 'function') {
        // @ts-ignore
        optionComponentName = vueComponent.options?.name;
      } else {
        optionComponentName = vueComponent.name;
      }
    }

    let name = getNameFromPath(path, optionComponentName);
    components[name] = vueComponent;
  });

  return components;
}

export function regVueComponents(vueComponentMap: VueComponentMap, Vue: VueConstructor) {
  Object.entries(vueComponentMap).forEach(([name, component]) => Vue.component<any>(name, component));
}