import { createVuePlugin } from '@/core/utils/createVuePlugin';
import axios from 'axios';

export let axiosPlugin = createVuePlugin(Vue => {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      let { response } = err;
      let { data } = response;
      let { error, code } = data;
      let msg = data.message || err.message || '';
      if (error == 401 || code == 401) {
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
});
