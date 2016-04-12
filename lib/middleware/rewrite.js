var libPath = require('path');
var libUrl = require('url');
var fs = require('fs');
var path2reg = require('path-to-regexp');
var jsonParser = require('body-parser').json();
var urlencoded = require('body-parser').urlencoded({extended: false});

var proxy = require('../proxy');
var _ = require('../util');

/**
 * 处理路由句柄
 */
function processHandle(handle, rulePath) {
  var type = typeof handle;
  var ruleDir;

  if(typeof rulePath === 'string') {
    ruleDir = libPath.dirname(rulePath);
  }else{
    ruleDir = process.cwd();
  }

  if(type === 'string') {
    // 代理或者返回文件
    if(handle.indexOf('http') === 0) {
      // http or https
      return function(req, res) {
        // 补全url
        var relUrl = _.resolveUrl(handle, req.params);
        if(relUrl !== handle){
          req.url = libUrl.parse(relUrl).path;
        }

        // 使用代理转发
        return proxy(req, res, {
          target: relUrl
        });
      };
    } else {
      return function(req, res, next) {
        var relativePath =  _.resolveUrl(handle, req.params);
        var filepath = libPath.resolve(ruleDir, relativePath);

        if(fs.existsSync(filepath)) {
          // 返回文件
          return res.sendFile(filepath);
        }else{
          res.send(handle);
        }
      };
    }
  }

  // {
  //  handle: 'xx',
  //  transform: xx
  // }
  if(_.isObject(handle)) {
    var realHandle = processHandle(handle.handle, rulePath);
    return function(req, res, next){
      res.jtr_transform = handle.transform;
      realHandle(req, res, next);
    };
  }

  if(typeof handle !== 'function') {
    return function(req, res) {
      res.send(handle)
    };
  }

  return function(req, res, next) {
    // https://github.com/nodejitsu/node-http-proxy/issues/180#issuecomment-97702206
    // Fix body Parser error
    jsonParser(req, res, function() {
      urlencoded(req, res, function() {
        handle(req, res, next);
      });
    });
  };
}

/**
 * 创建路由对象
 */
function createRule(path, handle, rulePath){
  var tmp = path.split(/\s+/);
  var method = 'all';

  if(tmp[0] && tmp[1]) {
    method = tmp[0].toLowerCase();
    path = tmp[1];
  }

  var regexp = path2reg(path);
  handle = processHandle(handle, rulePath);

  return {
    method: method,
    path: path,
    regexp: regexp,
    keys: regexp.keys,
    handle: handle
  };
}

/**
 * 加载路由文件
 */
function processRules(rules, ruleCache, dir) {
  if(typeof rules === 'string'){
    // 路由文件路径
    try {
      if( libPath.extname(rules) === '.js'){
        // delete require.cache[path];
        var ruleMap = require(rules);
        ruleCache[rules] = [];

        for(var i in ruleMap) {
          if(ruleMap.hasOwnProperty(i)) ruleCache[rules].push(createRule(i, ruleMap[i], rules));
        }
      }
      console.log('路由文件' + rules + '已经加载');
    } catch(e) {
      console.error('加载路由文件' + logPath + '出现了错误');
      console.error(e.message);
    }
  } else {
    // 具体路由表
    ruleCache['defaults'] = [];

    for(var i in rules) {
      if(rules.hasOwnProperty(i)) ruleCache['defaults'].push(createRule(i, rules[i], dir));
    }
  }
}

// 重写中间件暴露接口
module.exports = function(options) {
  var ruleCache = {defaults: []};

  processRules(options.rules, ruleCache, options.dir);

  return function(req, res, next) {
    // 请求进来后的处理
    var url = libUrl.parse(req.url);
    var method = req.method.toLowerCase();
    var applied = [];

    // checking ruleCache
    for(var i in ruleCache){
      var rules = ruleCache[i];
      for(var i = 0, len = rules.length; i < len; i++ ){

        var rule = rules[i];

        if((rule.method === 'all' || rule.method === method) && rule.regexp) {
          var params = _.getParam(rule.regexp ,url.pathname);
          if(params && rule.handle) {
            // 当匹配到对应方法和路由的时候
            applied.push({
              params: params,
              handle: rule.handle,
              path: rule.path
            });
          }
        }

      }
    }

    var alen = applied.length;
    if(!alen) return next();

    var cursor = -1;
    function nextStep(){
      cursor++
      if(cursor === alen) return next();
      var step = applied[cursor];
      req.params = step.params;
      try {
        step.handle(req, res, nextStep)
      } catch(e) {
        console.error('进入路由' + step.path + '时发生了错误');
        console.error(e.message);
        next();
      }
    }
    nextStep();
  }
}
