import axios from 'axios';

// 默认json
axios.defaults.headers['Content-Type'] = 'application/json';

class CacheStorage {
  static _storage: Record<string, any> = {};
  static _key(path: string, { params = {} } = {}) {
    return `${path}?${JSON.stringify(params)}`;
  }
  static get(path: string, config: any) {
    let key = CacheStorage._key(path, config);
    return CacheStorage._storage[key];
  }
  static set(path: string, config: any, data: any) {
    let key = CacheStorage._key(path, config);
    CacheStorage._storage[key] = data;
  }
}

export default class BaseModel {
  static axios = axios;

  private readonly _basePath: string;
  get $basePath() {
    return this._basePath;
  }

  constructor(basePath = '') {
    this._basePath = basePath;
  }

  $create(config: any) {
    return axios.create(config);
  }

  $get(path: string, config?: any) {
    // 优先从请求网络, 网络失败再从缓存获取
    return axios
      .get(this._basePath + path, config)
      .then(({ data }) => {
        CacheStorage.set(path, config, data);
        return data;
      })
      .catch(e => {
        console.log({ e });
        let cache = CacheStorage.get(path, config);
        //  && e.code == 'ECONNABORTED'
        if (cache) {
          return cache;
        } else {
          throw e.response && e.response.data;
        }
      });
  }

  $post(path: string, data?: any, config?: any) {
    return axios
      .post(this._basePath + path, data, config)
      .then(res => res.data)
      .catch(e => {
        throw e.response && e.response.data;
      });
  }

  $delete(path: string, config?: any) {
    return axios
      .delete(this._basePath + path, config)
      .then(res => res.data)
      .catch(e => {
        throw e.response && e.response.data;
      });
  }

  $put(path: string, data?: any, config?: any) {
    return axios
      .put(this._basePath + path, data, config)
      .then(res => res.data)
      .catch(e => {
        throw e.response && e.response.data;
      });
  }

  _keyBy<T extends Record<string, any>>(arr: T[], keyName: string) {
    let result: Record<string, T> = {};
    arr.forEach(item => {
      result[item[keyName]] = item;
    });
    Object.defineProperty(result, '_list_', {
      value: arr,
      enumerable: false
    });
    return result;
  }

  _parseJSON(obj: Record<string, any>, keyName: string) {
    try {
      obj[keyName] = JSON.parse(obj[keyName]);
    } catch (error) {
      console.warn('Model JSON.parse Error', obj[keyName], error);
      obj[keyName] = {
        _raw: obj[keyName]
      };
    }
    return obj;
  }
}
