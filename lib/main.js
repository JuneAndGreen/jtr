var express = require('express');
var velocity = require('express-velocity');
var ejs = require('ejs');
var path = require('path');
var http = require('http');

var injector = require('./middleware/injector');
var rewrite = require('./middleware/rewrite');
var folder = require('./middleware/folder');

var freemarker = require('./express-freemarker/index');
var _ = require('./util');

module.exports = function (options) {
  options = options || {};

  // 构建服务器
  var app = express();
  var server = http.createServer(app);

  // 默认配置参数
  _.extend(options, {
    views: 'views',
    engine: {},
    port: 8000,
    app: app,
    dir: process.cwd(),
    injector: []
  });

  if(typeof options.rules === 'string') {
    // 补全路由路径
    options.rules = path.resolve(options.rules);
  }

  // 设置视图路径
  var base = options.config ? path.resolve(options.dir, path.dirname(options.config)) : options.dir;
  options.views = path.resolve(base, options.views);
  app.set('views', options.views);


  // 默认使用velocity模板引擎
  var engine = options.engine;
  engine.vm = velocity({root: [options.views]});
  engine.ftl = freemarker();
  engine.ejs = ejs.renderFile;
  for(var i in engine) {
    if(engine.hasOwnProperty(i)) app.engine(i, engine[i]);
  }

  // 给res修改或追加一些特殊处理逻辑
  app.use(injector(options));

  // 重写路由，生成路由代理
  if(options.rules) app.use(rewrite(options));

  // 处理访问文件夹的情况
  app.use(folder(options));

  // 设置服务器根目录
  app.use(express.static(options.dir));

  // 异常控制
  app.use(function(err, req, res, next) {
    console.error(err.message || err);
    res.status(500).send('某些东东跪了ORZ……');
  });

  server.on('error', function(e) {
    if(e.code === 'EADDRINUSE') {
      // 接口已被使用，尝试接口加一
      console.log('端口' + options.port + '已被占用，尝试新端口' + (++options.port));
      setTimeout(start, 1000);
    } else {
      console.error(e.message);
    }
  });

  server.on('listening', function() {
    var url = 'http://localhost:' + options.port;
    console.log('代理服务器已成功启动，当前根路径为 ' + url);
    // 自动打开浏览器
    if(options.launch) _.openBrowser(url);
  })

  var tries = 1;
  function start() {
    if(tries++ >= 10) {
      console.error('尝试新端口过多，请手动切换到其他端口');
      return process.exit(0);
    }
    server.listen(options.port);
  }

  start();
}
