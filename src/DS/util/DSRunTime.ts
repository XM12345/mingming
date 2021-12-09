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

type IOSApi<F extends (...params: any[]) => any> = {
  postMessage(...params: Parameters<F>): ReturnType<F>;
};

function createGlobalCallbackFunctionName(callback: (this: {}, ...params: any[]) => void, isWatch = false) {
  let callbackName = `_callback${Date.now()}_`;
  // @ts-ignore
  window[callbackName] = (...params) => {
    callback.call({}, ...params);
    if (!isWatch) {
    }
  };
  return callbackName;
}

interface IDfsxNative {
  // 由原生APP注入的js对象
  platform: 'ios' | 'android' | 'web' | 'browser' | 'wechat' | '';
  version: string;
  isLogin: boolean;
  userToken: string | null;
  /** 登录 */
  login?: () => void;
  /** 返回到上一页 */
  back?: () => void;
  /** 跳转素材 */
  toMedia?: (obj: Object) => void;
  /** 跳转原生 */
  toPage?: (type: string, id: number) => void;
  /** 获取api */
  getUrl?: () => string;
}

declare global {
  interface Window {
    DfsxNative?: IDfsxNative;
    DfsxWeb?: {
      name: string;
      /** 刷新批注 */
      freshComment?: () => void;
      /** 刷新日志 */
      freshLogs?: () => void;
      /** 刷新状态 */
      freshState?: () => void;
    };
    webkit?: {
      messageHandlers: {
        /** 返回上一页 */
        back?: IOSApi<(json?: string | null) => void>;
        /** 获取api地址 */
        getUrl?: IOSApi<(json: string) => void>;
        /** 跳转原生登录 */
        login?: IOSApi<(json?: string | null) => void>;
        /** 跳转素材库 */
        toMedia?: IOSApi<(json: string) => void>;
        /** 跳转原生页面 */
        toPage?: IOSApi<(json: string) => void>;
      };
    };
  }
}

export class DSRunTime extends DSEvent {
  static instance: DSRunTime;
  _DfsxNative?: IDfsxNative;
  app = '';
  version = '';
  userToken = '';
  serverUrl = '';
  isLogin = false;
  platform = '';
  system = '';

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

  constructor() {
    super();
    if (DSRunTime.instance) {
      return DSRunTime.instance;
    }
    DSRunTime.instance = this;
    this.init(
      window.DfsxNative || {
        platform: '',
        version: <string>process.env.VUE_APP_VERSION,
        isLogin: false,
        userToken: ''
      }
    );
  }

  init(DfsxNative?: IDfsxNative) {
    this._DfsxNative = DfsxNative;
    // 判断是否嵌入在APP 获取具体平台；
    console.log('DSRunTime init get DfsxNative', DfsxNative);
    let { platform = '', version = '', isLogin = false, userToken = '' } = DfsxNative || ({} as any);

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
    if (!this.serverUrl) {
      this.serverUrl = queryStr.match(/serverUrl=([^&]*)/i)?.[1] || '';
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

  /** 获取api地址 */
  getUrl() {
    let url = '';
    if (this.serverUrl) {
      url = this.serverUrl;
    } else if (this._DfsxNative && this._DfsxNative.getUrl) {
      this.serverUrl = this._DfsxNative.getUrl();
      url = this.serverUrl;
    }
    return url;
  }

  /** 原生登录 */
  nativeLogin() {
    if (this._DfsxNative && this._DfsxNative.login) {
      this._DfsxNative.login();
      return true;
    } else if (window.webkit?.messageHandlers?.login) {
      window.webkit.messageHandlers?.login?.postMessage(null);
      return true;
    } else {
      return false;
    }
  }
  
  /** 原生返回 */
  nativeBack() {
    if (this._DfsxNative && this._DfsxNative.back) {
      this._DfsxNative.back();
      return true;
    } else if (window.webkit?.messageHandlers?.back) {
      window.webkit.messageHandlers?.back?.postMessage(null);
      return true;
    } else {
      return false;
    }
  }

  /** 跳转原生素材库 */
  nativeMedia(obj: Object) {
    if (this._DfsxNative && this._DfsxNative.toMedia) {
      this._DfsxNative.toMedia(JSON.stringify(obj));
      return true;
    } else if (window.webkit?.messageHandlers?.toMedia) {
      window.webkit.messageHandlers?.toMedia?.postMessage(JSON.stringify(obj));
      return true;
    } else {
      return false;
    }
  }

  /** 跳转原生页面 */
  nativePage(type: string, id: number) {
    if (this._DfsxNative && this._DfsxNative.toPage) {
      this._DfsxNative.toPage(type, id);
      return true;
    } else if (window.webkit?.messageHandlers?.toPage) {
      window.webkit.messageHandlers?.toPage?.postMessage(JSON.stringify({ type, id }));
      return true;
    } else {
      return false;
    }
  }
}

Object.defineProperty(window, 'DfsxNative', {
  get: () => {
    console.log('DSRunTime get DfsxNative');
    return new DSRunTime()._DfsxNative;
  },
  set: DfsxNative => {
    console.log('DSRunTime set DfsxNative', DfsxNative);
    let runTime = new DSRunTime();
    runTime.init(DfsxNative);
  }
});
window.DfsxWeb = { name: 'DfsxWeb' };
export default DSRunTime;
