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
import RunTime from '@/DS/util';

// 引入server_config
 const server_config = require('../../../server_config');
 let apiAddress = server_config.serverSettingsUrl;
// let apiAddress = RunTime.getUrl();

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
  News: new News(apiAddress + '/news/public')
};
