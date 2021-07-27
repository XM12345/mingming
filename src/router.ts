import Vue from 'vue';
import Router from 'vue-router';
import basePages from './DS/Pages';

let routes: any[] = flatRoutes(basePages);

function convertRoutes(routes: any = []) {
  if (Array.isArray(routes)) {
    return routes;
  } else {
    return Object.entries(routes).map(([path, route]: any, index) => {
      route.path = path;
      if (route.routes) {
        route.routes = convertRoutes(route.routes);
      }
      return route;
    });
  }
}

function flatRoutes(routes: any = [], basePath = '') {
  let routeList: any = [];
  if (!Array.isArray(routes)) {
    routes = convertRoutes(routes);
  }
  routes.forEach((route: any) => {
    if (basePath) {
      route.path = basePath + route.path;
    }
    routeList.push(route);
    if (route.routes) {
      routeList.push(...flatRoutes(route.routes, route.path));
    }
  });
  return routeList;
}

Vue.use(Router);
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes
});
