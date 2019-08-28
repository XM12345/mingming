import Vue from "vue";
import Filters from "./Filters";
// 注册 Filters
Object.keys(Filters).forEach(k => {
    Vue.filter(k, Filters[k]);
  });

export default {};
