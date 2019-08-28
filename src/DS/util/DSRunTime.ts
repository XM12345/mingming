/**
 * 安卓URL参数 ?token=<AppManager.getInstance().getIApp().getCurrentToken()>&client=android
 * 安卓原生APP注入的js
 * window.DfsxNative = {
 *   platform: 'android',
 *   version: <AndroidUtil.getAppVersionCode(getContext())>,
 *   isLogin: <AppManager.getInstance().getIApp().isLogin()>,
 *   userToken: <AppManager.getInstance().getIApp().getCurrentToken()>,
 *   login: function () {
 *     window.login.loginApp()
 *   },
 *   back: function () {
 *    // 回调原生的返回
 *   }
 *
 * };
 *
 */

/*

let {
  DfsxNative = {
    platform: 'web',
    version: config.version,
    isLogin: Vue.prototype.$Model.User.isLogin(),
    userToken: this.$Model.Base._token,
    login: () => {
      this.$toast('需要登录');
      this.$hui.push('/user/login');
    },
    back: () => {
      history.back();
    },
  }
} = window;

*/

class DSEvent {
  private _listeners: Record<string, Function[]> = {};

  on(type: string, callback: Function) {
    if (!(type in this._listeners)) {
      this._listeners[type] = [];
    }
    this._listeners[type].push(callback);
  }

  off(type: string, callback: Function) {
    if (!(type in this._listeners)) {
      return;
    }
    let stack = this._listeners[type];
    this._listeners[type] = stack.filter(fn => fn !== callback);
  }

  emit(type: string, data?: any) {
    if (!(type in this._listeners)) {
      return;
    }
    let stack = this._listeners[type];
    stack.forEach(callback => {
      callback.call(this, data);
    });
  }
}

// s.on('xxx', e => console.log('xxx', e, this))
// s.on('ttt', function(e) { console.log('ttt', e, this) })
// s.emit('xxx', '==')
// s.emit('ttt', { a: 90 })

interface IDfsxNative {
  // 由原生APP注入的js对象
  platform: 'ios' | 'android' | 'web' | 'browser' | 'wechat' | '';
  version: string;
  isLogin: boolean;
  userToken: string | null;
  login?: () => void;
  back?: () => void;
  toMedia?: (id: any) => void;
  getUrl?: () => string;
}

declare global {
  interface Window {
    DfsxNative?: IDfsxNative;
    DfsxWeb?: {
      name: string;
      freshComment?: () => void;
    };
  }
}

class DSRunTime extends DSEvent {
  static instance: DSRunTime;
  _DfsxNative?: IDfsxNative;

  app = '';
  version = '';
  userToken = '';
  serverUrl = null;
  isLogin = false;
  platform = '';
  system = '';

  name = '';
  constructor(DfsxNative?: IDfsxNative) {
    super();
    if (DSRunTime.instance) {
      return DSRunTime.instance;
    }
    DSRunTime.instance = this;
    this.init(DfsxNative);
  }

  init(DfsxNative?: IDfsxNative) {
    this._DfsxNative = DfsxNative;
    // 判断是否嵌入在APP 获取具体平台；
    let { platform = '', version = <string>process.env.VUE_APP_VERSION, isLogin = false, userToken = '' } =
      DfsxNative || ({} as any);

    let queryStr = location.search || '';
    if (!platform) {
      platform = (queryStr.match(/client=([^&]*)/i) || [])[1] || '';
      if (platform) {
        // 储存platform到本地，避免清空search内容后刷新导致platform信息丢失 出现平台判断失误
        sessionStorage.setItem('_DfsxNative_platform', platform);
      } else {
        platform = sessionStorage.getItem('_DfsxNative_platform') || '';
      }
    }
    platform = platform.toLowerCase();

    if (!userToken) {
      userToken = (queryStr.match(/token=([^&]*)/i) || [])[1] || '';
    }

    this.app = platform; // TODO: 修改判断方式  eg. _DfsxNative

    this.version = version;
    this.userToken = userToken;
    this.isLogin = isLogin || !!userToken;
    // 判断平台和系统
    if (platform) {
      this.platform = platform;
      this.system = platform;
    } else {
      let UA = window.navigator.userAgent || '';

      if (UA.match(/MicroMessenger/i)) {
        platform = 'wechat';
      } else if (UA.match(/TBS\/(\d*)/i)) {
        platform += 'tbs';
      } else {
        platform = 'browser';
      }
      this.platform = platform;

      let systemStr = (UA.match(/\(([^,]*?)\)/i) || [])[1] || '';
      if (systemStr.match(/iPhone OS/i)) {
        this.system = 'ios';
      } else if (systemStr.match(/Windows/i)) {
        this.system = 'windows';
      } else if (systemStr.match(/Android/i)) {
        this.system = 'android';
      } else {
        this.system = platform || systemStr || 'unknown';
      }
    }
    this.emit('update');
  }

  nativeLogin() {
    if (this._DfsxNative && this._DfsxNative.login) {
      this._DfsxNative.login();
      return true;
    } else {
      return false;
    }
  }

  nativeBack() {
    if (this._DfsxNative && this._DfsxNative.back) {
      this._DfsxNative.back();
      return true;
    } else {
      return false;
    }
  }
  nativeMedia(id: any) {
    if (this._DfsxNative && this._DfsxNative.toMedia) {
      this._DfsxNative.toMedia(id);
      return true;
    } else {
      return false;
    }
  }
  getUrl() {
    if (this._DfsxNative && this._DfsxNative.getUrl) {
      return this._DfsxNative.getUrl();
    }
  }

  get isApp() {
    return !!this.app;
  }
  get isAndroid() {
    return this.system == 'android';
  }
  get isiOS() {
    return this.system == 'ios';
  }
  get isWindows() {
    return this.system == 'windows';
  }
  get isTBS() {
    return this.platform && this.platform.indexOf('tbs') != -1;
  }
  get isWechat() {
    return this.platform && this.platform.indexOf('wechat') != -1;
  }
  get userAgentNumber() {
    // “user_agent”: <int, 终端类型 0-未知 1-ANDROID 2-IOS>,
    const AGENT: Record<string, number | undefined> = { android: 1, ios: 2 };
    return AGENT[this.app] || 0;
  }
}

let _DfsxNative = window.DfsxNative;

let runTime = new DSRunTime();
runTime.init(_DfsxNative);

Object.defineProperty(window, 'DfsxNative', {
  get: () => {
    console.log('DSRunTime get DfsxNative');
    return _DfsxNative;
  },
  set: DfsxNative => {
    console.log('DSRunTime set DfsxNative', DfsxNative);
    _DfsxNative = DfsxNative;
    runTime.init(_DfsxNative);
  }
});
window.DfsxWeb = { name: 'DfsxWeb' };
export default runTime;
