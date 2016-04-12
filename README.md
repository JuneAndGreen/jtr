# jtr

## 简介

这是一个从波神的神器[puer](https://github.com/leeluolee/puer)抽离出部分功能的工具，是一个超级简化版，只包含以下三个功能：

* 本地web服务
* 模板解析（目前内置支持velocity、freemarker和ejs，其他可自行定制）
* 路由代理

## 安装

```bash
npm install --save jtr
```

或者

```bash
npm install -g jtr
```

### 使用

```javascript
var jtr = require('jtr');

// 获取参数
var options = {
  port: 8001, // 端口号
  rules: {}, // 路由表，可为路径或对象
  dir: '/', // 服务器根目录
  views: '/WEB-INF/views/', // 视图目录
  launch: false, // 是否自动打开浏览器
  engine: {jade: require('jade').__express} // 自定义模板引擎
};

// 启动代理服务器
jtr(options);
```
