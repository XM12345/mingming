import BemClassName from '@/core/vue-plugins/BemClassName';
import { createVuePlugin } from '@/core/utils/createVuePlugin';
import Filters from './Filters';
import baseThirdComponents from './baseThirdComponents';
import Model from './Model';
import { RunTime } from './util';
import { axiosPlugin } from './util/axiosPlugin';

export let install = createVuePlugin(Vue => {
  Vue.use(BemClassName);
  Vue.use(Filters);
  Vue.use(baseThirdComponents);

  Vue.prototype.$Model = Model;
  Vue.prototype.$RunTime = RunTime;
  Vue.prototype.$title = function $title(title: string) {
    document.title = title;
  };

  Vue.prototype.$setQuery = function $setQuery(this: Vue, query: any) {
    this.$router.push({ query });
  };

  Vue.prototype.$login = function $login(this: Vue, message?: string) {
    if (RunTime.isApp && RunTime.nativeLogin()) {
      // needRefresh
      // 跳转到原生登陆界面
    } else {
      message && Vue.prototype.$toast(message);
      this.$router.push('/user/login');
    }
  };
  Vue.prototype.$back = function $back(this: Vue) {
    if (RunTime.nativeBack()) {
      // needRefresh
      // 回调原生返回
    } else {
      this.$router.back();
    }
  };

  Vue.prototype.$toMedia = function $toMedia(obj: Object) {
    if (RunTime.nativeMedia(obj)) {
      // needRefresh
      // 回调原生跳转到素材详情
    } else {
      Vue.prototype.$toast('请下载App');
    }
  };

  Vue.prototype.$toPage = function $toPage(this: Vue, type: string, id: number) {
    if (RunTime.nativePage(type, id)) {
      // needRefresh
      // 回调原生跳转到原生页面
    } else {
      let href = '';
      if (type == 'doc') {
        href = `/docs/${id}`;
      } else if (type == 'clue') {
        href = `/clues/${id}`;
      } else if (type == 'task') {
        href = `/subjects/tasks/${id}`;
      } else if (type == 'subject') {
        href = `/subjects/${id}`;
      }
      this.$router.push(href);
    }
  };

  Vue.use(axiosPlugin);
});

declare module 'vue/types/vue' {
  interface Vue {
    $Model: typeof Model;
    $title: (title?: string) => void;
    $setQuery: (query: any) => void;
    $login: (message?: string) => void;
    $back: () => void;
    $toMedia: (obj: Object) => void;
    $toPage: (type: string, id: number) => void;
  }
}
