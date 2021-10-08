import Vue from 'vue';
import zh from './zh';
import en from './en';
import zhF from './zh-f';
import langStorage from './langStorage';
import { numberFormats, dateTimeFormats } from './formatter';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

let default_lang = 'zh';
let locales = {
  zh: zh,
  en: en,
  zh_f: zhF
};

const i18n = new VueI18n({
  locale: langStorage.getLang(default_lang),
  fallbackLocale: default_lang,
  messages: locales,
  numberFormats,
  dateTimeFormats
});
declare global {
  interface Window {
    _i18n: typeof i18n;
  }
}
window._i18n = i18n;

export default i18n;
