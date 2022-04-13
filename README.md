# jsrt_app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### app use h5 path(hash)
```
通稿详情: #/clues/clue_id
文稿详情: #/docs/doc_id
选题详情: #/subjects/subject_id
任务详情: #/tasks/task_id
线索库详情: #/news/news_id
公告列表: #/notice
公告详情: #/notices/notice_id
公告管理详情: #/notices/manage/notice_id
微博: #/weibo
微博详情: #/weibo/articles/:article_id
微信: #/weixin
微信图文详情: #/weixin/:account_id/content/:content_id
微信文章详情: #/weixin/:account_id/content/:content_id/:article_id
串联单: #/series
串联单详情: #/series/:series_id
关注消息设置: #/user/message/follow
任务消息设置: #/user/message/task
新媒体详情: #/cms/content/id(暂不用)
新媒体统计页面: #/cms/stat?baview_token=

运维监控:
信号监控详情: #/signals/:signal_id
设备详情: #/devices/:device_id
机房设备详情: #/machine-roomes/devices/:device_id
应用详情: #/apps/:app_id
报警详情: #/alarms/:alarm_id
```