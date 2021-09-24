import type { VueConstructor } from 'vue/types/vue';

export function createVuePlugin<T>(_install: (Vue: VueConstructor, config: T) => void) {
  function install(Vue: VueConstructor, config: T) {
    if (install.installed) {
      return;
    }
    install.installed = true;
    _install(Vue, config);
  }
  install.installed = false;
  return install;
}
