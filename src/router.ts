import Vue from 'vue';
import Router from 'vue-router';
import base from './DS/Pages';

let group: any[] = base.pages.map(item => item.pages);
let routes: any[] = [].concat(...group);

Vue.use(Router);
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes
});
