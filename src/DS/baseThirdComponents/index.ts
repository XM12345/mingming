import Vue from 'vue';
import { Toast, MessageBox, Popup, Switch, Picker } from 'mint-ui';
import { PullRefresh, List } from 'vant';
import DSLoadmore from './ds-loadmore.vue';

export default function install() {
  Vue.component(Popup.name, Popup);
  Vue.component(Switch.name, Switch);
  Vue.component(Picker.name, Picker);

  Vue.use(List);
  Vue.use(PullRefresh);
  Vue.component('ds-loadmore', DSLoadmore);

  (Vue as any).$toast = Vue.prototype.$toast = Toast;
  Vue.prototype.$messagebox = MessageBox;
}

declare module 'vue/types/vue' {
  interface Vue {
    $message: typeof MessageBox;
  }
}
