import Vue from 'vue';
import { Toast, Dialog, Popup, PullRefresh, List, DatetimePicker, Switch, Picker } from 'vant';
import { DialogOptions } from 'vant/types/dialog';
import DSLoadmore from './ds-loadmore.vue';

export default function install() {
  Vue.use(List);
  Vue.use(PullRefresh);
  Vue.use(Dialog);
  Vue.use(Popup);
  Vue.use(DatetimePicker);
  Vue.use(Switch);
  Vue.use(Picker);
  Vue.component('ds-loadmore', DSLoadmore);

  Vue.prototype.$toast = Toast;

  Vue.prototype.$confirm = (message: string, option: DialogOptions = {}, beforeClose?: any) => {
    return Dialog.confirm({ title: '提示', message, ...option }).then(
      (res: any) => res === 'confirm',
      (e: any) => undefined
    );
  };

  Vue.prototype.$alert = (message: string, option: DialogOptions = {}) => {
    return Dialog.alert({ message, ...option }).then(
      (res: any) => res === 'confirm',
      (e: any) => undefined
    );
  };
}

declare module 'vue/types/vue' {
  interface Vue {
    $alert(message: string, option?: DialogOptions): Promise<boolean | undefined>;
    $confirm(message: string, option?: DialogOptions): Promise<boolean | undefined>;
  }
}
