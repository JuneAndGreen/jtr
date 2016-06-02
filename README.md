# jtr

## 简介

这是一个基于express的简单本地容器，并追加了一些针对nei项目特殊定制的服务，目前只包含以下三个功能：

* 本地web服务
* 模板解析（目前内置支持velocity、freemarker和ejs，其他可自行定制）
* 路由代理

关于nei项目的接入方式可戳[这里](./doc/nei.md)。

## 安装

```bash
npm install --save jtr
```

或者

```bash
npm install -g jtr
```

### 使用

#### 使用命令行

```bash
Usage: jtr [options]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -p, --port <port>    代理服务器端口，默认为8000
  -c, --config [path]  配置文件路径，默认取当前路径下的jtr.js
  -d, --dir [path]     代理服务器的根目录，默认是process.cwd()
  --no-launch          是否要停止自动打开浏览器
```

#### 作为依赖的模块使用

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
