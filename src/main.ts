import Vue from 'vue';
import axios from 'axios';
/* TODO:语言切换 */
import i18n from './libs/i18n';

import App from './App.vue';
import router from './router';
import store from './store';

/* 引入DS */
import DS from '@/DS';
import Model from './DS/Model';
import RunTime from '@/DS/util';

/* 引入mint-ui */
import { Loadmore, Toast, Popup } from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.component(Loadmore.name, Loadmore);
Vue.component(Popup.name, Popup);
Vue.prototype.$toast = Toast;

/* // 后退缓存上一页
let list: any = [];
router.beforeEach((to, from, next) => {
  let length = list.length;
  if (length == 0 || list[length - 1] != to.name) {
    // 前进
    to.meta.isKeepLive = false;
    from.meta.isKeepLive = false;
    list.push(from.name);
    //console.log('前进');
    next();
  } else {
    // 后退
    to.meta.isKeepLive = true;
    from.meta.isKeepLive = true;
    list.splice(length - 1, 1);
    //console.log(to.name, to, '后退');
    next();
  }
}); */

let ds = DS;
Vue.prototype.$Model = Model;
Vue.prototype.$RunTime = RunTime;

Vue.prototype.$login = function $login(message: any, needRefresh: any) {
  if (RunTime.isApp && RunTime.nativeLogin()) {
    // needRefresh
    // 跳转到原生登陆界面
  } else {
    message && this.$toast(message);
    router.push('/user/login');
  }
};
Vue.prototype.$back = function $back() {
  if (RunTime.nativeBack()) {
    // needRefresh
    // 回调原生返回
  } else {
    history.back();
  }
};

Vue.prototype.$toMedia = function $toMedia(obj: any) {
  if (RunTime.nativeMedia(obj)) {
    // needRefresh
    // 回调原生跳转到素材详情
  } else {
    Vue.prototype.$toast('请下载App');
  }
};

Vue.prototype.$title = function $title(title: any) {
  document.title = title;
};

// axois拦截
axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    let { response } = err;
    let { data } = response;
    let { error } = data;
    if (error == 401) {
      Vue.prototype.$login('操作前请先登录');
    } else if (error == 30002) {
      Vue.prototype.$toast('正在跳转授权公众号中...');
    } else {
      Vue.prototype.$toast(data);
    }
    return Promise.reject(err);
  }
);

declare module 'vue/types/vue' {
  interface Vue {
    $Model: typeof Model;
    $toast: typeof Toast;
    $login: any;
    $back: any;
    $toMedia: any;
    $title: any;
  }
}
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
