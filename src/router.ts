import Vue from 'vue';
import Router from 'vue-router';
import cc from './site';

let pages: any[] = [];
let routes = pages.concat(cc.pages);
Vue.use(Router);
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes
});
