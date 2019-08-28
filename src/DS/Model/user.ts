import BaseModel from './baseModel';
import RunTime from '@/DS/util';
let axios = BaseModel.axios;

export default class User extends BaseModel {
  set _token(token) {
    if (token) {
      axios.defaults.headers.common['X-CSRF-Token'] = token;
      localStorage.setItem('user_token', token);
    } else {
      delete axios.defaults.headers.common['X-CSRF-Token'];
      localStorage.removeItem('user_token');
    }
  }
  get _token() {
    return axios.defaults.headers.common['X-CSRF-Token'];
  }

  constructor(basePath: string) {
    super(basePath);
    //  TOKEN 处理
    if (RunTime.isApp) {
      // 如果是客户端（原生APP）中，从URL读取token
      // TODO 在原生APP中不记录token, 由APP管理
      this._token = RunTime.userToken;
    } else {
      // 不是客户端（可能是微信登录带有token）
      this._token = localStorage.getItem('user_token') || RunTime.userToken;
    }
    RunTime.on('update', () => {
      // APP重新注入js后主动更新登录状态
      this._token = RunTime.userToken;
      console.log('update', this);
    });

    // alert(`${localStorage.getItem('user_token')} || ${RunTime.userToken}`)
  }
  isLogin() {
    // TODO ？ 首次调用 通过网络判断token是否有效，如果无效则静默清除token
    if (RunTime.isApp) {
      // APP原生信息
      return RunTime.isLogin && RunTime.userToken;
      // let { isLogin, userToken } = RunTime;
      // 取消被动更新登录状态，改由监听主动RunTime状态
      // if (isLogin && userToken) {
      //   this._token = userToken;
      //   return true;
      // }
    }
    return !!this._token;
  }

  login(username: any, password: any, token: string, remember_login = true) {
    //let params = { username, password, remember_login };
    //return super.$post("/members/login", params);
    let work;
    if (token !== undefined) {
      this._token = token;
      work = super.$get('/members/current', { _noToast: true }).then(user => ({ token, user }));
    } else {
      work = super.$post('/members/login', { username, password, remember_login }).then(data => {
        let { token, user } = data;
        //   Save Token
        this._token = token;
        return { token, user };
      });
    }
    return work.catch(e => {
      this._token = null;
      throw e;
    });
  }
}
