var fs = require('fs');
var path = require('path');
var nei = require('./lib/nei');
var _ = require('./lib/util');

var cwd = process.cwd();

module.exports = function(config) {
  var options = config;

  if(options.fromNei) {
    // nei项目的接入
    config = options.config;

    if(!config || typeof config === 'string') {
      // 如果没有配置项，直接找当前目录下的jtr.js
      try {
        config = require(config ? config : path.join(cwd, './jtr.js'));
      } catch(e) {
        console.error('缺少相关配置文件，请确保当前目录下有jtr.js文件，或者用-c指定配置文件路径');
        process.exit(1);
      }
    }

    nei.setting({
      api: config.neiApi || '',
      view: config.viewRoot,
      mockTpl: config.mockTpl || '',
      mockApi: config.mockApi || '',
      viewExt: config.viewExt || '.ftl'
    });
    config.routes = nei.getRoutes(config.routes);

    options = {
      port: config.port,
      rules: config.routes,
      dir: config.webRoot,
      views: config.viewRoot,
      launch: config.launch,
      engine: _.isObject(config.engine) ? config.engine : {},
      nei: true
    };
  }
  require('./lib/main')(options);
};
