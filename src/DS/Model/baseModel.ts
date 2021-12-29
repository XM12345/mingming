import axios, { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    _noToast?: boolean;
    _noLogin?: boolean;
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

  $create(config: AxiosRequestConfig) {
    return axios.create(config);
  }

  $setConfig(config: AxiosRequestConfig = {}, data?: any) {
    if (['string', 'boolean', 'number'].includes(typeof data)) {
      data = String(data);
      config['headers'] = config['headers'] || {};
      config['headers']['Content-Type'] = 'application/json';
    }
    return config;
  }

  $get(path: string, config?: AxiosRequestConfig) {
    return axios
      .get(this._basePath + path, config)
      .then(({ data }) => {
        return data;
      })
      .catch(e => {
        throw (e.response && e.response.data) || e;
      });
  }

  $post(path: string, data?: any, config?: AxiosRequestConfig) {
    config = this.$setConfig(config, data);
    return axios
      .post(this._basePath + path, data, config)
      .then(res => res.data)
      .catch(e => {
        throw (e.response && e.response.data) || e;
      });
  }

  $delete(path: string, config?: AxiosRequestConfig) {
    return axios
      .delete(this._basePath + path, config)
      .then(res => res.data)
      .catch(e => {
        throw (e.response && e.response.data) || e;
      });
  }

  $put(path: string, data?: any, config?: AxiosRequestConfig) {
    config = this.$setConfig(config, data);
    return axios
      .put(this._basePath + path, data, config)
      .then(res => res.data)
      .catch(e => {
        throw (e.response && e.response.data) || e;
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
