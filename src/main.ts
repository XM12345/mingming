/* es6转es5 */
import 'babel-polyfill';
require('es6-promise').polyfill();
import Vue from 'vue';
/* TODO:语言切换 */
import i18n from './libs/i18n';
import router from './router';
import store from './store';
import { install } from '@/DS';
/* 引入公共样式文件 */
import './style.scss';
/* 使用vue-navigation插件缓存页面 */
import Navigation from 'vue-navigation';
import App from './App.vue';

Vue.use(Navigation, { router });
Vue.use(install);

/* 阻止启动生产消息 */
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
