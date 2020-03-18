/* es6转es5 */
import 'babel-polyfill';
require('es6-promise').polyfill();

import MobileView from 'mobile-view';
MobileView();

import Vue from 'vue';
import axios from 'axios';
/* TODO:语言切换 */
import i18n from './libs/i18n';

import App from './App.vue';
import router from './router';
import store from './store';

/* 引入公共样式文件 */
import './style.scss';

/* 使用vue-navigation插件缓存页面 */
import Navigation from 'vue-navigation';
Vue.use(Navigation, { router });

/* 引入DS */
import DS from '@/DS';
import Model from './DS/Model';
import RunTime from '@/DS/util';

/* 引入mint-ui */
import { Loadmore, Toast, Popup, Switch, Picker } from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.component(Loadmore.name, Loadmore);
Vue.component(Popup.name, Popup);
Vue.component(Switch.name, Switch);
Vue.component(Picker.name, Picker);
Vue.prototype.$toast = Toast;

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
    let msg = data.message || err.message || '';
    if (error == 401) {
      Vue.prototype.$login('操作前请先登录');
    } else if (error == 30002) {
      Vue.prototype.$toast('正在跳转授权公众号中...');
    } else if (error == 404) {
    } else {
      let options = err.config;
      if (options.method == 'get') {
        if (options._noToast === false) {
          // get请求 默认不显示错误toast，除非明确指定
          Vue.prototype.$toast(msg);
        }
      } else {
        if (options._noToast !== true) {
          // 非get请求 默认显示错误toast，除非明确指定
          Vue.prototype.$toast(msg);
        }
      }
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
