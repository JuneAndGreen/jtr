# nei 接入指南

## 直接通过jtr命令启动nei项目

首先需要准备nei项目的配置文件，默认是当前路径下的nei.json，其结构如下：

```json
{
  /* 根目录 */
  "webRoot": "./demo/webapp/",
  /* 视图目录 */
  "viewRoot": "./demo/webapp/WEB-INF/views/",
  /* 路由 */
  "routes": {
    /* 异步接口 */
    "GET /api/xxx/get": {"id": 15278, "method": "get", "path": "/api/xxx/get"},
    "GET /api/xxx/info/get":  {"id": 15277, "method": "get", "path": "/api/xxx/info/get"},
    /* 同步模板 */
    "GET /": {"index": 0, "list":[{"id": 10947, "path": "index"}]}
  },
  /* 是否自动打开浏览器 */
  "launch": true,
  /* 端口 */
  "port": 8001,
  /* nei项目的在线数据url */
  "neiApi": "",
  /* 同步模块mock数据路径 */
  "mockTpl": "./demo/webapp/WEB-INF/views/mock/",
  /* 异步接口mock数据路径 */
  "mockApi": "./demo/webapp/src/mock/",
  /* 模板后缀 */
  "viewExt": ".ftl"
}
```

然后在配置文件所在目录下执行：

```bash
jtr --nei
```

假若你的配置文件在其他目录或者叫其他名字，可执行如下命令：

```bash
jtr --nei -c [path]
```

## 通过依赖jtr模块来启动nei项目

引用方式如下，注意路径不能是相对路径，不然会获取失败：

```javascript
var jtr = require('jtr');
var path = require('path');

jtr({
  fromNei: true, // 表示这是nei项目
  config: {
    /* 根目录 */
    webRoot: path.join(__dirname, './demo/webapp/'),
    /* 视图目录 */
    viewRoot: path.join(__dirname, './demo/webapp/WEB-INF/views/'),
    /* 路由 */
    routes: {
      /* 异步接口 */
      'GET /api/xxx/get': {id: 15278, method: 'get', path: '/api/xxx/get'},
      'GET /api/xxx/info/get':  {id: 15277, method: 'get', path: '/api/xxx/info/get'},
      /* 同步模板 */
      'GET /': {index: 0, list:[{id: 10947, path: 'index'}]}
    },
    /* 是否自动打开浏览器 */
    launch: true,
    /* 端口 */
    port: 8001,
    /* nei项目的在线数据url */
    neiApi: ,
    /* 同步模块mock数据路径 */
    mockTpl: path.join(__dirname, './demo/webapp/WEB-INF/views/mock/'),
    /* 异步接口mock数据路径 */
    mockApi: path.join(__dirname, './demo/webapp/src/mock/'),
    /* 模板后缀 */
    viewExt: '.ftl'
  }
});
```
