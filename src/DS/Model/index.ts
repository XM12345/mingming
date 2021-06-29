import BaseModel from './baseModel';
import General from './general';
import User from './user';
import Media from './media';
import Clue from './clue';
import Doc from './doc';
import Weixin from './weixin';
import Weibo from './weibo';
import Subject from './subject';
import News from './news';
import Stream from './stream';
import Monitor from './monitor';
import Cms from './cms';
import RunTime from '@/DS/util';

let apiAddress = process.env.NODE_ENV === 'development' ? 'http://192.168.8.107:8000/api' : RunTime.getUrl();

export default {
  Base: new BaseModel(),
  General: new General(apiAddress + '/internal'),
  User: new User(apiAddress + '/internal'),
  Media: new Media(apiAddress + '/media/internal'),
  Clue: new Clue(apiAddress + '/clue/internal'),
  Doc: new Doc(apiAddress + '/doc/internal'),
  Weixin: new Weixin(apiAddress + '/weixin/internal'),
  Weibo: new Weibo(apiAddress + '/microblog'),
  Subject: new Subject(apiAddress + '/subject/internal'),
  News: new News(apiAddress + '/news/public'),
  Stream: new Stream(apiAddress + '/stream/public'),
  Monitor: new Monitor(apiAddress + '/monitor/internal'),
  Cms: (baview_api_url: any) => new Cms(baview_api_url + '/cms')
};
