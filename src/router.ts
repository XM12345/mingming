import Vue from 'vue';
import Router from 'vue-router';
import base from './DS/Pages';

let group: any[] = base.pages.map(item => item.pages);
let routes: any[] = [].concat(...group);

/* const originalPush = Router.prototype.push;
Router.prototype.push = function push(location: any) {
  return originalPush.call(this, location).catch((err: any) => err);
}; */
Vue.use(Router);
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes
});
